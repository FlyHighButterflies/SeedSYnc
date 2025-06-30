from flask import Flask, request, jsonify
from service.scoring_rules import (
    calculate_score,
    apply_branch_and_bound,
    hash_farmers,
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

    # Always use Branch and Bound
    selected_farmers = apply_branch_and_bound(farmers, buyer, options)
    if not selected_farmers:
        return jsonify([])

    # Always use Hash farmers (for fast ID lookup if needed)
    htable = hash_farmers(selected_farmers)

    # Scoring
    results = []
    for farmer in selected_farmers:
        score = calculate_score(farmer, buyer)
        results.append({
            "farmer_id": farmer.get("farmer_id") or farmer.get("_id") or farmer.get("id"),
            "score": round(score, 3),
            "matchedCrops": farmer.get("matchedCrops", []),
            "inventory": farmer.get("inventory", []),
            "score_breakdown": farmer.get("score_breakdown", {}),  # Include breakdown
        })

    results = sorted(results, key=lambda x: x["score"], reverse=True)
    return jsonify(results)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8000)