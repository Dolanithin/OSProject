# ipc_framework.py
"""
A simple IPC framework supporting:
 - Pipes (multiprocessing.Pipe)
 - Queues (multiprocessing.Queue)
 - Shared memory (multiprocessing.shared_memory.SharedMemory)
Security features:
 - HMAC-SHA256 signing for integrity/authenticity
 - Optional Fernet encryption (if cryptography is installed)
 - Basic Access Control (ACL) by client_id -> allowed_channels
Demo at bottom shows usage.
"""

import os
import time
import json
import base64
import hmac
import hashlib
import multiprocessing as mp
from multiprocessing import shared_memory
from typing import Optional, Dict, Any, Tuple

# Try optional encryption (Fernet) if cryptography is installed
try:
    from cryptography.fernet import Fernet
    _HAS_FERNET = True
except Exception:
    _HAS_FERNET = False

def _b64(x: bytes) -> str:
    return base64.b64encode(x).decode('ascii')

def _unb64(s: str) -> bytes:
    return base64.b64decode(s.encode('ascii'))

class SecurityManager:
    def __init__(self, secret: bytes, enable_encryption: bool = False):
        """
        secret: bytes used for HMAC; should be random and kept private.
        enable_encryption: if True and Fernet available, will encrypt payloads.
        """
        if not isinstance(secret, (bytes, bytearray)):
            raise ValueError("secret must be bytes")
        self.secret = secret
        self.enable_encryption = enable_encryption and _HAS_FERNET
        if enable_encryption and not _HAS_FERNET:
            print("[SecurityManager] cryptography not available — running without payload encryption")
        self._fernet = Fernet(base64.urlsafe_b64encode(hashlib.sha256(secret).digest())) if self.enable_encryption else None

    def sign_envelope(self, meta: dict, payload_b64: str) -> str:
        """
        Computes HMAC-SHA256 over meta_json + '.' + payload_b64
        """
        meta_json = json.dumps(meta, sort_keys=True, separators=(',',':')).encode('utf-8')
        msg = meta_json + b'.' + payload_b64.encode('ascii')
        sig = hmac.new(self.secret, msg, hashlib.sha256).digest()
        return _b64(sig)

    def verify_envelope(self, meta: dict, payload_b64: str, sig_b64: str) -> bool:
        expected = self.sign_envelope(meta, payload_b64)
        # Use hmac.compare_digest to avoid timing attacks
        return hmac.compare_digest(expected, sig_b64)

    def maybe_encrypt(self, data: bytes) -> bytes:
        if self._fernet:
            return self._fernet.encrypt(data)
        return data

    def maybe_decrypt(self, data: bytes) -> bytes:
        if self._fernet:
            return self._fernet.decrypt(data)
        return data

class AccessControl:
    def __init__(self):
        # channel_name -> set(client_id)
        self._acl = {}

    def allow(self, channel_name: str, client_id: str):
        self._acl.setdefault(channel_name, set()).add(client_id)

    def revoke(self, channel_name: str, client_id: str):
        if channel_name in self._acl:
            self._acl[channel_name].discard(client_id)

    def is_allowed(self, channel_name: str, client_id: str) -> bool:
        allowed = self._acl.get(channel_name)
        # If channel not in ACL map -> deny by default
        return allowed is not None and client_id in allowed

class IPCManager:
    def __init__(self, security_manager: SecurityManager, access_control: Optional[AccessControl] = None):
        self.sec = security_manager
        self.acl = access_control or AccessControl()
        self._channels = {}  # name -> implementation-specific object(s)

    # ---------------------
    # Channel creation APIs
    # ---------------------
    def create_queue(self, name: str):
        q = mp.Queue()
        self._channels[name] = ('queue', q)
        return q

    def create_pipe(self, name: str) -> Tuple[Any, Any]:
        parent_conn, child_conn = mp.Pipe(duplex=True)
        self._channels[name] = ('pipe', (parent_conn, child_conn))
        return parent_conn, child_conn

    def create_shared_memory(self, name: str, size: int = 1024):
        # create new shared memory block
        shm = shared_memory.SharedMemory(create=True, size=size)
        # store metadata about channel as name -> ('shm', shm, size)
        self._channels[name] = ('shm', (shm, size))
        return shm

    # ---------------------
    # Helper: package/unpackage
    # ---------------------
    def _package_message(self, client_id: str, raw: bytes) -> str:
        # Optionally encrypt payload
        encrypted = self.sec.maybe_encrypt(raw)
        payload_b64 = _b64(encrypted)
        meta = {"client_id": client_id, "ts": int(time.time())}
        sig = self.sec.sign_envelope(meta, payload_b64)
        envelope = {"meta": meta, "payload": payload_b64, "hmac": sig}
        return json.dumps(envelope, separators=(',',':'))

    def _unpackage_message(self, envelope_json: str) -> Tuple[dict, bytes]:
        envelope = json.loads(envelope_json)
        meta = envelope["meta"]
        payload_b64 = envelope["payload"]
        sig_b64 = envelope["hmac"]
        if not self.sec.verify_envelope(meta, payload_b64, sig_b64):
            raise ValueError("HMAC verification failed")
        data = _unb64(payload_b64)
        # decrypt if needed
        raw = self.sec.maybe_decrypt(data)
        return meta, raw

    # ---------------------
    # Send/receive operations
    # ---------------------
    def send_queue(self, name: str, client_id: str, raw_bytes: bytes):
        if name not in self._channels: raise KeyError("No such channel")
        kind, obj = self._channels[name]
        if kind != 'queue': raise TypeError("Channel is not a queue")
        if not self.acl.is_allowed(name, client_id): raise PermissionError("client not allowed on this channel")
        q = obj
        env = self._package_message(client_id, raw_bytes)
        q.put(env)

    def recv_queue(self, name: str, client_id: str, timeout: Optional[float] = None) -> Tuple[dict, bytes]:
        if name not in self._channels: raise KeyError("No such channel")
        kind, obj = self._channels[name]
        if kind != 'queue': raise TypeError("Channel is not a queue")
        if not self.acl.is_allowed(name, client_id): raise PermissionError("client not allowed on this channel")
        q = obj
        env = q.get(timeout=timeout)  # may block or raise
        return self._unpackage_message(env)

    def send_pipe(self, name: str, sender_conn, client_id: str, raw_bytes: bytes):
        # sender_conn should be one end of the Pipe
        if not self.acl.is_allowed(name, client_id): raise PermissionError("client not allowed on this channel")
        env = self._package_message(client_id, raw_bytes)
        sender_conn.send(env)

    def recv_pipe(self, name: str, receiver_conn, client_id: str, timeout: Optional[float] = None) -> Tuple[dict, bytes]:
        if not self.acl.is_allowed(name, client_id): raise PermissionError("client not allowed on this channel")
        if timeout is not None:
            # Can't set timeout on Pipe.recv directly, use poll
            if not receiver_conn.poll(timeout):
                raise TimeoutError("Timeout waiting on pipe")
        env = receiver_conn.recv()
        return self._unpackage_message(env)

    def write_shared_memory(self, name: str, client_id: str, raw_bytes: bytes):
        if name not in self._channels: raise KeyError("No such channel")
        kind, obj = self._channels[name]
        if kind != 'shm': raise TypeError("Channel is not shared memory")
        if not self.acl.is_allowed(name, client_id): raise PermissionError("client not allowed on this channel")
        shm, size = obj
        env = self._package_message(client_id, raw_bytes).encode('utf-8')
        if len(env) > size:
            raise ValueError("Message too big for shared memory block")
        # Zero out then write
        shm.buf[:size] = b'\x00' * size
        shm.buf[:len(env)] = env

    def read_shared_memory(self, name: str, client_id: str) -> Tuple[dict, bytes]:
        if name not in self._channels: raise KeyError("No such channel")
        kind, obj = self._channels[name]
        if kind != 'shm': raise TypeError("Channel is not shared memory")
        if not self.acl.is_allowed(name, client_id): raise PermissionError("client not allowed on this channel")
        shm, size = obj
        # read until first zero
        raw = bytes(shm.buf[:size]).split(b'\x00', 1)[0]
        if not raw:
            raise ValueError("No message in shared memory")
        env_json = raw.decode('utf-8')
        return self._unpackage_message(env_json)

    # ---------------------
    # Utilities: cleanup
    # ---------------------
    def unlink_shared_memory(self, name: str):
        if name not in self._channels: raise KeyError("No such channel")
        kind, obj = self._channels[name]
        if kind != 'shm': raise TypeError("Channel is not shared memory")
        shm, size = obj
        try:
            shm.close()
            shm.unlink()
        except Exception:
            pass
        del self._channels[name]

# ---------------------
# Demo usage (run as __main__)
# ---------------------
def worker_queue(manager: IPCManager, channel_name: str, client_id: str):
    try:
        meta, raw = manager.recv_queue(channel_name, client_id, timeout=5)
        print(f"[worker_queue:{client_id}] got meta={meta}, msg={raw.decode()}")
        # reply by putting reversed message
        reply = raw[::-1]
        manager.send_queue(channel_name, client_id, reply)
        print(f"[worker_queue:{client_id}] replied")
    except Exception as e:
        print("[worker_queue] error:", e)

def worker_pipe(receiver_conn, manager: IPCManager, channel_name: str, client_id: str):
    try:
        meta, raw = manager.recv_pipe(channel_name, receiver_conn, client_id, timeout=5)
        print(f"[worker_pipe:{client_id}] got meta={meta}, msg={raw.decode()}")
        manager.send_pipe(channel_name, receiver_conn, client_id, b"ACK:"+raw)
    except Exception as e:
        print("[worker_pipe] error:", e)

def worker_shm(name: str, manager: IPCManager, client_id: str):
    try:
        meta, raw = manager.read_shared_memory(name, client_id)
        print(f"[worker_shm:{client_id}] got meta={meta}, msg={raw.decode()}")
        # write response
        manager.write_shared_memory(name, client_id, b"REPLY:"+raw)
    except Exception as e:
        print("[worker_shm] error:", e)

if __name__ == "__main__":
    # Demo run
    secret = os.urandom(32)
    sec = SecurityManager(secret=secret, enable_encryption=False)  # set True if cryptography available & desired
    acl = AccessControl()
    mgr = IPCManager(sec, acl)

    # Setup queue channel
    qname = "jobs"
    q = mgr.create_queue(qname)
    acl.allow(qname, "clientA")
    acl.allow(qname, "workerA")

    # Parent puts message as clientA
    msg = b"Hello workerA via QUEUE"
    mgr.send_queue(qname, "clientA", msg)
    # spawn worker process that consumes and replies
    p = mp.Process(target=worker_queue, args=(mgr, qname, "workerA"), daemon=True)
    p.start()
    p.join(timeout=6)

    # Try to receive reply (the worker used same queue to reply)
    try:
        meta, raw = mgr.recv_queue(qname, "clientA", timeout=3)
        print("[main] Received reply over queue:", raw.decode(), "meta:", meta)
    except Exception as e:
        print("[main] queue receive error:", e)

    # ---------------------
    # Pipe demo
    # ---------------------
    pname = "pipe1"
    parent_conn, child_conn = mgr.create_pipe(pname)
    # allow client and worker
    acl.allow(pname, "clientB")
    acl.allow(pname, "workerB")
    # spawn a worker that will use child_conn
    pw = mp.Process(target=worker_pipe, args=(child_conn, mgr, pname, "workerB"), daemon=True)
    pw.start()
    # client sends
    mgr.send_pipe(pname, parent_conn, "clientB", b"Hello workerB via PIPE")
    # client receives response
    meta, raw = mgr.recv_pipe(pname, parent_conn, "clientB", timeout=5)
    print("[main] pipe reply:", raw.decode(), "meta:", meta)
    pw.join(timeout=2)

    # ---------------------
    # Shared memory demo
    # ---------------------
    shm_name = "shm1"
    shm = mgr.create_shared_memory(shm_name, size=4096)
    acl.allow(shm_name, "clientC")
    acl.allow(shm_name, "workerC")
    # Write message into shm by clientC
    mgr.write_shared_memory(shm_name, "clientC", b"Hello workerC via SHM")
    # spawn worker that reads and writes reply back
    ps = mp.Process(target=worker_shm, args=(shm_name, mgr, "workerC"), daemon=True)
    ps.start()
    ps.join(timeout=3)
    # client read reply
    meta, raw = mgr.read_shared_memory(shm_name, "clientC")
    print("[main] shm reply:", raw.decode(), "meta:", meta)

    # cleanup
    mgr.unlink_shared_memory(shm_name)
    print("Demo complete.")
