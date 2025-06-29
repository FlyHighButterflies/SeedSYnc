from service.proximity import haversine_distance
from service.branch_and_bound import branch_and_bound
from service.string_search import bmhs
from service.hashing import HashTable

def calculate_score(farmer, buyer, options, graph):
    score = 0

    # A* Proximity or Location Match
    if options.get("use_astar") and graph:
        from service.proximity import a_star
        coords = {node["id"]: (node["latitude"], node["longitude"]) for node in [farmer, buyer]}
        path = a_star(graph, farmer["id"], buyer["id"], coords)
        path_length = len(path) - 1 if path else 999
        proximity_score = max(1 - (path_length / 10), 0)  # Normalize: shorter paths = higher score
        score += 0.3 * proximity_score
    else:
        score += 0.3 * (1.0 if farmer.get("location") == buyer.get("location") else 0.5)

    # Inventory Score
    product = buyer.get("product")
    inventory_score = min(farmer.get("inventory", {}).get(product, 0) / 100, 1.0)
    score += 0.3 * inventory_score

    # Rating Score
    rating_score = farmer.get("rating", 3.0) / 5.0
    score += 0.2 * rating_score

    # Sustainability Score
    if farmer.get("sustainability"):
        score += 0.2

    # BMHS keyword match
    if options.get("use_bmhs"):
        desc = farmer.get("description", "")
        keyword = buyer.get("product", "")
        if bmhs(desc.lower(), keyword.lower()) != -1:
            score += 0.1

    return min(score, 1.0)  # Ensure max score is 1.0


def apply_branch_and_bound_if_enabled(farmers, buyer, options):
    if options.get("use_branch_and_bound"):
        best = branch_and_bound(farmers, buyer)
        return [best] if best else []
    return farmers


def hash_farmers_if_enabled(farmers, options):
    if options.get("use_hashing"):
        htable = HashTable()
        for f in farmers:
            htable.put(f["id"], f)
        return htable
    return None