import json
from collections import defaultdict
from datetime import datetime

def load_json(filepath):``
    """Load JSON data from a file."""
    try:
        with open(filepath, 'r', encoding="utf-8") as f:
            return json.load(f)
    except (FileNotFoundError, json.JSONDecodeError) as e:
        print(f"Error loading JSON: {e}")
        return []

def find_duplicates(data):
    """Find duplicate entries based on 'name' and 'professor'."""
    duplicates_map = defaultdict(list)

    for item in data:
        key = (item.get("name"), item.get("professor"))  

        if all(key): 
            duplicates_map[key].append(item)

    return {str(key): values for key, values in duplicates_map.items() if len(values) > 1}

def remove_invalid_duplicates(data, duplicates):
    """Remove items that are duplicates without a merged key or with an empty merged key."""
    valid_data = []
    for item in data:
        key = (item.get("name"), item.get("professor"))
        if str(key) in duplicates:
            merged_key = item.get("merged_key")  
            if merged_key and merged_key.strip():
                valid_data.append(item)
        else:
            valid_data.append(item)

    return valid_data

def save_json(data, output_filepath):
    """Save JSON data to a file."""
    try:
        with open(output_filepath, "w", encoding="utf-8") as outfile:
            json.dump(data, outfile, indent=4, ensure_ascii=False)
    except IOError as e:
        print(f"Error writing JSON: {e}")

def main():
    input_filepath = "./data/merged-finalized-merge.json"
    timestamp = datetime.now().strftime("%Y%m%d%H%M%S")
    output_filepath = "data/merged-finalized-merge-without-dup.json"

    data = load_json(input_filepath)
    if data:
        duplicates = find_duplicates(data)
        
        cleaned_data = remove_invalid_duplicates(data, duplicates)
        
        
        save_json(cleaned_data, output_filepath)
        print(f"Cleaned data saved to {output_filepath}")
    else:
        print("No valid data to process.")

if __name__ == "__main__":
    main()
