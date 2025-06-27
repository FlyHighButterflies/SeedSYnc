from flask import Flask, request, jsonify
from service.scoring_rules import (
    calculate_score,
    apply_branch_and_bound_if_enabled,
    hash_farmers_if_enabled,
)

app = Flask(__name__)

@app.route("/", methods=["GET"])
def home():
    return jsonify({"message": "Hello! Welcome to the AI Agent API! Use /match to find farmers."})

@app.route("/match", methods=["POST"])
def match():
    data = request.get_json()
    buyer = data.get("buyer", {})
    farmers = data.get("farmers", [])
    options = data.get("options", {})
    graph = data.get("graph", {})  # Optional A* routing graph

    # Optional: Branch and Bound override
    selected_farmers = apply_branch_and_bound_if_enabled(farmers, buyer, options)
    if not selected_farmers:
        return jsonify([])

    # Optional: Hash farmers (for fast ID lookup if needed)
    htable = hash_farmers_if_enabled(selected_farmers, options)

    # Scoring
    results = []
    for farmer in selected_farmers:
        score = calculate_score(farmer, buyer, options, graph)
        results.append({
            "farmer_id": farmer["id"],
            "score": round(score, 3)
        })

    results = sorted(results, key=lambda x: x["score"], reverse=True)
    return jsonify(results)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8000)