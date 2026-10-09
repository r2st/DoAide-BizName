"""Trademark search helper — matches a business name against Indian Nice Classification classes."""
from __future__ import annotations

NICE_CLASSES = [
    {"number": 1, "title": "Chemicals", "keywords": ["chemical", "industrial", "adhesive", "fertilizer", "reagent", "resin"]},
    {"number": 2, "title": "Paints", "keywords": ["paint", "varnish", "lacquer", "colorant", "dye", "ink", "coating"]},
    {"number": 3, "title": "Cosmetics & Cleaning", "keywords": ["cosmetic", "soap", "perfume", "beauty", "cleaning", "shampoo", "skincare", "lotion"]},
    {"number": 4, "title": "Fuels & Lubricants", "keywords": ["fuel", "oil", "lubricant", "candle", "wax", "petroleum", "grease"]},
    {"number": 5, "title": "Pharmaceuticals", "keywords": ["pharma", "medicine", "drug", "medical", "health", "supplement", "vitamin", "ayurvedic", "herbal"]},
    {"number": 6, "title": "Metal Goods", "keywords": ["metal", "steel", "iron", "hardware", "pipe", "wire", "aluminum"]},
    {"number": 7, "title": "Machinery", "keywords": ["machine", "engine", "motor", "pump", "generator", "manufacturing"]},
    {"number": 8, "title": "Hand Tools", "keywords": ["tool", "cutlery", "razor", "blade", "knife", "scissors"]},
    {"number": 9, "title": "Electronics & Software", "keywords": ["software", "app", "computer", "electronic", "tech", "digital", "mobile", "saas", "ai", "data", "cloud", "sensor", "battery"]},
    {"number": 10, "title": "Medical Devices", "keywords": ["medical device", "surgical", "dental", "prosthetic", "therapeutic"]},
    {"number": 11, "title": "Lighting & HVAC", "keywords": ["lighting", "lamp", "heating", "cooling", "air conditioner", "water purifier", "oven"]},
    {"number": 12, "title": "Vehicles", "keywords": ["vehicle", "automobile", "car", "bike", "bicycle", "transport", "tyre", "ev", "scooter"]},
    {"number": 13, "title": "Firearms & Explosives", "keywords": ["firearm", "explosive", "ammunition", "firework"]},
    {"number": 14, "title": "Jewelry", "keywords": ["jewelry", "jewellery", "watch", "gold", "silver", "diamond", "precious", "gem"]},
    {"number": 15, "title": "Musical Instruments", "keywords": ["music", "instrument", "guitar", "piano", "drum"]},
    {"number": 16, "title": "Paper & Stationery", "keywords": ["paper", "stationery", "book", "printing", "notebook", "pen", "packaging"]},
    {"number": 17, "title": "Rubber & Plastics", "keywords": ["rubber", "plastic", "insulation", "packing", "foam"]},
    {"number": 18, "title": "Leather Goods", "keywords": ["leather", "bag", "luggage", "wallet", "umbrella", "handbag", "suitcase"]},
    {"number": 19, "title": "Building Materials", "keywords": ["building", "construction", "cement", "brick", "timber", "glass", "stone"]},
    {"number": 20, "title": "Furniture", "keywords": ["furniture", "mattress", "mirror", "frame", "shelf", "cabinet"]},
    {"number": 21, "title": "Household Goods", "keywords": ["kitchen", "utensil", "cookware", "glassware", "ceramic", "brush"]},
    {"number": 22, "title": "Ropes & Textiles", "keywords": ["rope", "net", "tent", "tarpaulin", "sack", "fibre"]},
    {"number": 23, "title": "Yarns & Threads", "keywords": ["yarn", "thread", "textile fiber", "weaving"]},
    {"number": 24, "title": "Fabrics", "keywords": ["fabric", "textile", "linen", "curtain", "bedding", "towel"]},
    {"number": 25, "title": "Clothing", "keywords": ["clothing", "apparel", "fashion", "garment", "shoe", "footwear", "hat", "shirt", "dress"]},
    {"number": 26, "title": "Haberdashery", "keywords": ["button", "zipper", "ribbon", "embroidery", "badge", "pin"]},
    {"number": 27, "title": "Carpets", "keywords": ["carpet", "rug", "mat", "flooring", "wallpaper"]},
    {"number": 28, "title": "Toys & Games", "keywords": ["toy", "game", "sport", "gym", "fitness equipment", "cricket", "board game"]},
    {"number": 29, "title": "Processed Foods", "keywords": ["food", "dairy", "milk", "cheese", "egg", "meat", "pickle", "jam", "oil"]},
    {"number": 30, "title": "Staple Foods", "keywords": ["rice", "flour", "bread", "bakery", "coffee", "tea", "spice", "sauce", "chocolate", "sugar", "snack"]},
    {"number": 31, "title": "Agricultural Products", "keywords": ["agriculture", "farm", "seed", "plant", "flower", "fruit", "vegetable", "animal feed"]},
    {"number": 32, "title": "Beverages", "keywords": ["beverage", "drink", "juice", "water", "soda", "beer", "energy drink"]},
    {"number": 33, "title": "Alcoholic Beverages", "keywords": ["alcohol", "wine", "whisky", "rum", "vodka", "liquor", "spirits"]},
    {"number": 34, "title": "Tobacco", "keywords": ["tobacco", "cigarette", "cigar", "smoking"]},
    {"number": 35, "title": "Advertising & Business Services", "keywords": ["advertising", "marketing", "business", "retail", "ecommerce", "e-commerce", "agency", "franchise", "consulting", "d2c"]},
    {"number": 36, "title": "Financial Services", "keywords": ["finance", "banking", "insurance", "investment", "fintech", "payment", "loan", "real estate"]},
    {"number": 37, "title": "Construction & Repair", "keywords": ["construction", "repair", "installation", "maintenance", "plumbing", "electrical"]},
    {"number": 38, "title": "Telecommunications", "keywords": ["telecom", "communication", "broadcasting", "internet", "streaming", "network"]},
    {"number": 39, "title": "Transport & Logistics", "keywords": ["transport", "logistics", "delivery", "shipping", "courier", "warehouse", "travel", "packaging"]},
    {"number": 40, "title": "Manufacturing Services", "keywords": ["manufacturing", "processing", "printing", "recycling", "treatment"]},
    {"number": 41, "title": "Education & Entertainment", "keywords": ["education", "training", "school", "coaching", "edtech", "entertainment", "publishing", "event", "fitness", "yoga"]},
    {"number": 42, "title": "IT & Scientific Services", "keywords": ["it", "software", "saas", "platform", "hosting", "cloud", "design", "research", "engineering", "ai", "tech", "web", "api"]},
    {"number": 43, "title": "Food & Hospitality", "keywords": ["restaurant", "hotel", "cafe", "catering", "food service", "hospitality", "bar", "canteen"]},
    {"number": 44, "title": "Medical & Beauty Services", "keywords": ["medical", "hospital", "clinic", "dental", "beauty", "salon", "spa", "wellness", "healthcare"]},
    {"number": 45, "title": "Legal & Security Services", "keywords": ["legal", "law", "security", "detective", "licensing", "patent"]},
]


def search_trademark_classes(name: str, industry: str = "") -> list[dict]:
    query = f"{name} {industry}".lower()
    terms = query.split()

    scored = []
    for cls in NICE_CLASSES:
        score = 0
        matched_keywords = []
        for kw in cls["keywords"]:
            for term in terms:
                if term in kw or kw in term:
                    score += 2
                    matched_keywords.append(kw)
                    break
        if score > 0:
            scored.append({
                "class_number": cls["number"],
                "title": cls["title"],
                "relevance_score": min(score, 10),
                "matched_keywords": list(set(matched_keywords)),
            })

    scored.sort(key=lambda x: x["relevance_score"], reverse=True)
    return scored[:10]
