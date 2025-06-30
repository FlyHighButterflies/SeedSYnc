from service.proximity import a_star
from service.branch_and_bound import branch_and_bound
from service.string_search import bmhs
from service.hashing import HashTable
from service.ph_graph import philippines_graph

def calculate_score(farmer, buyer):
    score = 0

    # Always use A* Proximity (use address)
    path = a_star(philippines_graph, farmer.get("address", ""), buyer.get("address", ""))
    proximity_score = 1 / len(path) if path else 0.1
    score += 0.3 * proximity_score

    # Inventory Score: check if farmer's inventory contains the cropId needed by buyer
    crop_id = buyer.get("cropId")
    farmer_inventory = set(farmer.get("inventory", []))  # list of crop ObjectIds
    inventory_score = 1.0 if crop_id in farmer_inventory else 0.0
    score += 0.3 * inventory_score

    # Review Score: use farmer's rating field (0-5)
    rating = farmer.get("rating", 0)
    review_score = rating / 5.0
    score += 0.2 * review_score

    # Sustainability: use farmerInfo.certification/farmingPractices as proxy
    farmer_info = farmer.get("farmerInfo", {})
    if farmer_info.get("certification") or farmer_info.get("farmingPractices"):
        score += 0.2

    # Always use BMHS keyword match: match buyer's qualityStandards to farmer's certification/farmingPractices
    desc = (farmer_info.get("certification", "") + " " + farmer_info.get("farmingPractices", "")).strip()
    keyword = buyer.get("buyerInfo", {}).get("qualityStandards", "")
    if bmhs(desc.lower(), keyword.lower()) != -1:
        score += 0.1

    return score

def apply_branch_and_bound(farmers, buyer, options):
    if options.get("use_branch_and_bound"):
        best = branch_and_bound(farmers, buyer)
        return [best] if best else []
    return farmers

def hash_farmers(farmers):
    # Always use hashing
    htable = HashTable()
    for f in farmers:
        htable.put(f.get("_id") or f.get("id"), f)
    return htable