from PIL import Image
import os

img = Image.open("./brand_assets/fyn_brand_overview.jpg")
W, H = img.size

# Exact crops based on the brand kit overview grid (1024 x 682)
crops = {
    # Bottom Row Products
    "fyn_kraft_bag.jpg": (10, 440, 160, 680),
    "fyn_forest_hoodie.jpg": (160, 440, 305, 680),
    "fyn_sand_tee.jpg": (305, 440, 465, 680),
    "fyn_travel_duffel.jpg": (465, 440, 670, 680),
    "fyn_travel_umbrella.jpg": (670, 440, 875, 680),
    "fyn_expedition_backpack.jpg": (875, 440, 1015, 680),
    
    # Middle Row Products
    "fyn_model_tee.jpg": (10, 275, 185, 440),
    "fyn_hoodie_detail.jpg": (185, 275, 395, 440),
    "fyn_classic_caps.jpg": (395, 275, 605, 440),
    "fyn_bottle_tag.jpg": (605, 275, 785, 440),
    "fyn_travel_pillars.jpg": (785, 275, 1015, 440),
    
    # Top Row Hero Elements
    "fyn_crew_sunset.jpg": (10, 230, 410, 400),
    "fyn_mountain_panorama.jpg": (730, 240, 1015, 400)
}

os.makedirs("./brand_assets/products", exist_ok=True)

for name, box in crops.items():
    cropped = img.crop(box)
    cropped.save(f"./brand_assets/products/{name}", quality=95)
    print(f"Saved: {name} {cropped.size}")

print("All product mockup images extracted successfully.")
