# backend/app.py
from flask import Flask, jsonify, request, abort
from uuid import uuid4
import threading, queue, time

app = Flask(__name__)

# Simple in-memory simulation of queues (not persistent) with ACLs and basic token check.
QUEUES = {}
TOKENS = {"service-A": "token-A", "service-B": "token-B"}  # example tokens

def check_auth():
    token = request.headers.get("Authorization", "")
    # Bearer token format: "Bearer token-A"
    if not token.startswith("Bearer "):
        return None
    token = token.split(" ",1)[1]
    # find service
    for svc, tok in TOKENS.items():
        if tok == token:
            return svc
    return None

@app.route("/api/queues", methods=["POST"])
def create_queue():
    user = check_auth()
    if not user:
        abort(401)
    body = request.get_json() or {}
    name = body.get("name")
    acl = body.get("acl", [])
    if not name:
        return jsonify({"error":"name required"}), 400
    if name in QUEUES:
        return jsonify({"error":"exists"}), 409
    QUEUES[name] = {
        "q": queue.PriorityQueue(),
        "acl": set(acl),
        "meta": {"created_by": user, "name": name}
    }
    return jsonify({"created":name}), 201

@app.route("/api/queues/<qname>/publish", methods=["POST"])
def publish(qname):
    user = check_auth()
    if not user:
        abort(401)
    if qname not in QUEUES:
        return jsonify({"error":"no such queue"}), 404
    # check acl if present
    acl = QUEUES[qname]["acl"]
    if acl and user not in acl:
        return jsonify({"error":"forbidden"}), 403
    body = request.get_json() or {}
    priority = int(body.get("priority", 10))
    payload = body.get("payload", "")
    # In real system: decrypt / verify / store securely
    QUEUES[qname]["q"].put((priority, {"id": str(uuid4()), "payload": payload, "sender": user}))
    return jsonify({"published":True}), 200

@app.route("/api/queues/<qname>/consume", methods=["GET"])
def consume(qname):
    user = check_auth()
    if not user:
        abort(401)
    if qname not in QUEUES:
        return jsonify({"error":"no such queue"}), 404
    acl = QUEUES[qname]["acl"]
    if acl and user not in acl:
        return jsonify({"error":"forbidden"}), 403
    # simple non-blocking consume with optional long-poll param (timeout seconds)
    timeout = float(request.args.get("timeout", 0))
    try:
        if timeout > 0:
            item = QUEUES[qname]["q"].get(timeout=timeout)
        else:
            item = QUEUES[qname]["q"].get_nowait()
        return jsonify({"message": item[1]}), 200
    except queue.Empty:
        return jsonify({"message":None}), 204

@app.route("/api/queues", methods=["GET"])
def list_queues():
    user = check_auth()
    if not user:
        abort(401)
    return jsonify({"queues": list(QUEUES.keys())})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
