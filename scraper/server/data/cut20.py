import json


def cut20():
    with open("1-ks-merged.json", "r", encoding="utf-8") as f:
        data = json.load(f)

        number_of_items_to_be_cut = 20
        new_data = data[:number_of_items_to_be_cut]

        with open("1-ks-merged-cut20.json", "w", encoding="utf-8") as fw:
            json.dump(new_data, fw)


if __name__ == "__main__":
    cut20()
