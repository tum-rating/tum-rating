import json

def addNot():
    with open("./data/3-production-ks-merged.json", "r", encoding="utf-8") as f:
        data = json.load(f)
        for item in data:
            if "merged" in item and len(item["merged"]) > 0:
                item["notResolvedCount"] = len(item["merged"])
        for idx, item in enumerate(data):
            if "notResolvedCount" in item:
                print(idx)
                print(item)
                print(item["notResolvedCount"])  
        with open("./data/3-production-ks-merged.json", "w", encoding="utf-8") as f:
            json.dump(data, f, indent=4, ensure_ascii=False)

if __name__ == "__main__":
    addNot()
