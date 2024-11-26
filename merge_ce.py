import json
import argparse
from difflib import SequenceMatcher
from collections import defaultdict
import re
import bisect
import numpy as np

tcdid ={
    149: 1,
    150: 2,
    152: 3,
    153: 4,
    154: 5,
    155: 6,
    162: 7,
    151: 8,
    156: 9,
    157: 10,
    148: 11,
    163: 12,
    165: 13,
    166: 14,
    158: 15,
    160: 16,
    172: 17,
    171: 18,
    175: 19,
    176: 20,
    178: 21,
    179: 22,
    161: 23,
    177: 24,
    181: 25,
    167: 26,
    180: 27,
    182: 28,
    183: 29,
    184: 30,
    186: 31,
    185: 32,
    159: 33,
    169: 34,
    187: 35,
    188: 36,
    168: 37,
    173: 38,
}

def compute_similarity(a, b):
    """Compute similarity between two strings using SequenceMatcher."""
    return SequenceMatcher(None, remove_non_french_characters(a), remove_non_french_characters(b)).ratio()

def are_similar(entry1, entry2, threshold=0.9):
    """Check if two entries are similar based on text, query, and options."""
    text_sim = compute_similarity(entry1["text"], entry2["text"])
    query_sim = compute_similarity(entry1["query"], entry2["query"])
    options_sim = compute_similarity(
        " ".join(entry1["options"]), " ".join(entry2["options"])
    )
    return (text_sim + query_sim + options_sim) / 3 >= threshold

def merge_entries(entry, similar_entries):
    """Merge similar entries into one."""
    ids = [entry["id"]]
    test_ids = [f"{entry['testId']}/{entry['id']}"]
    answer_different = False
    base_answer = entry["answer"]

    for similar_entry in similar_entries:
        ids.append(similar_entry["id"])
        test_ids.append(f"{similar_entry['testId']}/{similar_entry['id']}")
        if similar_entry["answer"] != base_answer:
            answer_different = True

    # Update the entry with merged information
    entry["id_avg"] = sum(ids) / len(ids)
    entry["testIds"] = test_ids
    entry["answerDifferent"] = answer_different
    return entry

def merge_dup(entry, similar_entries):
    keys = [tcdid[entry["testId"]]]
    test_ids = [f"{tcdid[entry['testId']]},{entry['id']}"]
    
    for similar_entry in similar_entries:
        keys.append(tcdid[similar_entry["testId"]])
        test_ids.append(f"{tcdid[similar_entry['testId']]},{similar_entry['id']}")
    
    test_ids.sort(key=dict(zip(test_ids, keys)).get)
    return test_ids

def remove_non_french_characters(text):
    # Regex to match HTML tags
    regex = r"<[^>]+>"
    
    # Replace HTML tags with a white space
    text = re.sub(regex, " ", text)
    
    # Define a pattern that matches characters that are valid in French (including accented letters)
    # This allows: a-z, A-Z, accented characters, and spaces.
    pattern = r'[^a-zA-Zàâçéèêëîïôùûüÿñæœ\s\n]'
    text = re.sub(pattern, '', text)
    # replace multiple spaces with a single space.
    text = re.sub(r'\s+', ' ', text).strip().lower()
    return text

def get_words(text, start, end):
    """Get the first three words from a text (case-insensitive)."""
    return " ".join(remove_non_french_characters(text).split()[start:end])

def build_index(entries):
    """Build an index of first three words to locate potential similar entries."""
    index = []
    all_text_concat = ""
    
    for i, entry in enumerate(entries):
        text = remove_non_french_characters(" ".join(entry["options"]))
        start_pos = len(all_text_concat)  # position where current text starts
        end_pos = start_pos + len(text)  # position where current text ends
        
        all_text_concat += text + " "  # Concatenate all texts, lowercase
        index.append((start_pos, end_pos))

    return index, all_text_concat

def find_covering_index(intervals, new_interval):
    i, j = new_interval
    
    # Use bisect to find the position to insert the start of the new interval
    starts = [start for start, _ in intervals]
    pos = bisect.bisect_left(starts, i)
    
    # Check if the interval at pos covers the new interval
    if pos < len(intervals):
        start, end = intervals[pos]
        if start <= i and end >= j:
            return pos
    
    # Otherwise, the interval isn't covered
    return None

def get_occ_tcf_q_id(entry):
    occ = len(entry["testIds"])
    tid, qid = entry["testIds"][0].split('/')
    return occ*10000 + int(tid)*100 + int(qid)

def get_level_tcf_q_id(entry):
    level = entry["id_avg"]
    tid, qid = entry["testIds"][0].split('/')
    return level*10000 + int(tid)*100 + int(qid)

def merge_json_files(file_list, threshold=0.9):
    """Merge JSON files based on entry similarity."""
    all_entries = []
    
    # Read all JSON files
    for filepath in file_list:
        with open(filepath.strip(), 'r') as f:
            all_entries.extend(json.load(f))

    # Build the index and track positions
    index, all_text_concat = build_index(all_entries)

    merged_entries = []
    duplicate_entries = []
    used = set()  # Track merged entries
    
    for i, entry1 in enumerate(all_entries):
        if i in used:
            continue

        # Filter matches to find entries that overlap with the current entry's start and end positions
        similar_entries = []
        used.add(i)  # Mark the current entry as used
        matches = []
        
        # Get potential similar entries by finding several words and their start position
        words = [get_words(" ".join(entry1["options"]), 0, 2), get_words(" ".join(entry1["options"]), -3, -1)]
        for word in words:
            matches.append([match for match in re.finditer(re.escape(word), all_text_concat)])

        for word_i, word in enumerate(words):
            for match in matches[word_i]:
                start_pos = match.start()
                end_pos = match.end()
                j = find_covering_index(index, (start_pos, end_pos))

                if j is None:
                    continue
                entry2 = all_entries[j]

                if i != j and j not in used and are_similar(entry1, entry2, threshold):
                    similar_entries.append(entry2)
                    used.add(j)
        
        # Merge entry1 with its similar entries
        merged_entry = merge_entries(entry1, similar_entries)
        merged_entries.append(merged_entry)

        duplicate_entry = merge_dup(entry1, similar_entries)
        if len(duplicate_entry) > 1:
            duplicate_entries.append(duplicate_entry)
    
    # sort by text
    # merged_entries.sort(key=lambda x: remove_non_french_characters(x["text"]))
    
    # sort by occurrence, tcfid, qid
    merged_entries.sort(key=lambda x: get_occ_tcf_q_id(x))
    
    # sort by question level, tcfid, qid
    # merged_entries.sort(key=lambda x: get_level_tcf_q_id(x))
    
    for i, entry in enumerate(merged_entries):
        entry["id"] = i + 1
    
    duplicate_entries_np = np.array(duplicate_entries)
    duplicate_entries_keys = []
    for x in duplicate_entries:
        e_t_id, e_q_id = x[0].split(",")
        e_k = int(e_t_id) * 100 + int(e_q_id)
        duplicate_entries_keys.append(e_k)
    sorted_indices = np.argsort(np.array(duplicate_entries_keys))
    sorted_array = duplicate_entries_np[sorted_indices]
    duplicate_entries = sorted_array.tolist()
    
    return merged_entries, duplicate_entries

if __name__ == "__main__":
    # Parse command-line arguments
    parser = argparse.ArgumentParser(description="Merge JSON files based on similarity.")
    parser.add_argument("file_list", type=str, help="Path to the file containing the list of JSON file paths.")
    parser.add_argument("output_file", type=str, help="Path to save the merged JSON file.")
    parser.add_argument("dup_file", type=str, help="Path to save the duplicated JSON file.")
    parser.add_argument("stat_file", type=str, help="Path to save the statistic JSON file.")
    
    args = parser.parse_args()

    # Read file paths from the provided file
    with open(args.file_list, "r") as file:
        file_list = file.readlines()
    
    # Merge the JSON files
    merged_data, dup_data = merge_json_files(file_list)

    # Write merged data to the specified output file
    with open(args.output_file, "w") as outfile:
        json.dump(merged_data, outfile, indent=4, ensure_ascii=False)
    
    if args.output_file.endswith(".json"):
        batch_file = args.output_file[:-5]
    
    # Write merged data in batch, each file has 100 records
    for i in range(0, len(merged_data), 100):
        data = merged_data[i: i + 100]
        batch_id = int(i / 100) + 1
        with open(f"{batch_file}-{batch_id:02d}.json", "w") as outfile:
            json.dump(data, outfile, indent=4, ensure_ascii=False)
    
    # Write dup data to the specified output file
    with open(args.dup_file, "w") as dup_file:
        dup_file.write("[\n")
        for i, entry in enumerate(dup_data):
            dup_file.write("    ")
            json.dump(entry,dup_file)
            # print(entry, file=dup_file, end="")
            if i < len(dup_data) - 1:
                dup_file.write(",")
            dup_file.write("\n")
        dup_file.write("]")

    # Write stat data to the specified output file
    with open(args.stat_file, "w") as stat_file:
        result = {
            "A1": 0,
            "A2": 0,
            "B1": 0,
            "B2": 0,
            "C1": 0,
            "C2": 0,
            "A1-A2": 0,
            "B1-B2": 0,
            "C1-C2": 0,
        }
        
        for entry in merged_data:
            level = entry["id_avg"]
            if level < 5:
                result["A1"] += 1
                result["A1-A2"] += 1
            elif level < 11:
                result["A2"] += 1
                result["A1-A2"] += 1
            elif level < 20:
                result["B1"] += 1
                result["B1-B2"] += 1
            elif level < 30:
                result["B2"] += 1
                result["B1-B2"] += 1
            elif level < 36:
                result["C1"] += 1
                result["C1-C2"] += 1
            else:
                result["C2"] += 1
                result["C1-C2"] += 1
        
        json.dump(result, stat_file, indent=4, ensure_ascii=False)