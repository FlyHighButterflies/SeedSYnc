from service.proximity import a_star
from service.branch_and_bound import branch_and_bound
from service.string_search import bmhs
from service.hashing import HashTable
from service.ph_graph import philippines_graph
import re

def extract_province_from_address(address):
    # Use BMHS for fuzzy province matching in address
    addr = address.lower()
    for prov in philippines_graph.keys():
        prov_norm = prov.replace("-", "").replace(" ", "").lower()
        if bmhs(addr.replace("-", "").replace(" ", ""), prov_norm) != -1:
            return prov
        # Also try direct substring match for robustness
        if bmhs(addr, prov.lower()) != -1:
            return prov
    return None

def calculate_score(farmer, buyer):
    score = 0
    score_breakdown = {}

    # Always use A* Proximity (use address)
    farmer_region = extract_province_from_address(farmer.get("address", ""))
    buyer_region = extract_province_from_address(buyer.get("address", ""))
    path = a_star(philippines_graph, farmer_region, buyer_region)
    proximity_score = 1 / len(path) if path else 0.1
    score += 0.3 * proximity_score
    score_breakdown["proximity"] = 0.3 * proximity_score

    # Integrated Inventory + Weight Score
    buyer_crop_names = buyer.get("names") or [buyer.get("name", "") or buyer.get("cropName", "")]
    farmer_inventory = set(farmer.get("inventory", []))  # list of crop names
    inventory_score = 0.0
    matched_crops = []
    weight_needed = buyer.get("weightNeeded")
    # Use currentWeight if available, else fallback to initialWeight
    current_weight = farmer.get("currentWeight")
    if current_weight is None:
        current_weight = farmer.get("initialWeight")
    for crop_name in buyer_crop_names:
        for inv_crop_name in farmer_inventory:
            if bmhs(inv_crop_name.lower(), crop_name.lower()) != -1:
                # Only count as match if weight is sufficient
                if weight_needed is None or (current_weight is not None and current_weight >= weight_needed):
                    inventory_score = 1.0
                    matched_crops.append(crop_name)
    score += 0.3 * inventory_score
    score_breakdown["inventory_weight"] = 0.3 * inventory_score

    # Review Score: use farmer's rating field (0-5)
    rating = farmer.get("rating", 0)
    review_score = rating / 5.0
    score += 0.2 * review_score
    score_breakdown["review"] = 0.2 * review_score

    # Sustainability: use farmerInfo.certification/farmingPractices as proxy
    farmer_info = farmer.get("farmerInfo", {})
    sustainability_score = 0.1 if (farmer_info.get("certification") or farmer_info.get("farmingPractices")) else 0.0
    score += sustainability_score
    score_breakdown["sustainability"] = sustainability_score

    # Always use BMHS keyword match: match buyer's qualityStandards to farmer's certification/farmingPractices
    desc = (farmer_info.get("certification", "") + " " + farmer_info.get("farmingPractices", "")).strip()
    keyword = buyer.get("buyerInfo", {}).get("qualityStandards", "")
    keyword_score = 0.1 if bmhs(desc.lower(), keyword.lower()) != -1 else 0.0
    score += keyword_score
    score_breakdown["quality_standards"] = keyword_score

    # Attach matched crops for downstream use
    farmer["matchedCrops"] = matched_crops
    farmer["farmer_id"] = farmer.get("_id") or farmer.get("id")

    # Attach breakdown for downstream use
    farmer["score_breakdown"] = score_breakdown

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