def branch_and_bound(farmers, buyer):
    best_score = -1
    best_farmer = None

    def bound(farmer):
        return farmer["inventory"].get(buyer["product"], 0)

    for farmer in farmers:
        if bound(farmer) < 10:  # cutoff: not enough crop
            continue
        score = (
            bound(farmer) * (farmer["review"] / 5.0)
        )
        if score > best_score:
            best_score = score
            best_farmer = farmer

    return best_farmer