def bound(farmer, buyer):
    # Check if buyer's cropId is in farmer's inventory (list)
    return int(buyer["cropId"] in farmer["inventory"])

def branch_and_bound(farmers, buyer):
    best = None
    best_score = float('-inf')
    for farmer in farmers:
        if bound(farmer, buyer) < 1:  # cutoff: not enough crop
            continue
        score = (
            bound(farmer, buyer) * (farmer.get("rating", 0) / 5.0)
        )
        if score > best_score:
            best_score = score
            best = farmer

    return best