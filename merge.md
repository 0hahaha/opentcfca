1. Run the find command to generate the list of JSON files:

```bash
find CE/ -type f -name "*.json" | grep -E '/[0-9]{3}\.json$' | sort > CE/file_list.txt
find CO/ -type f -name "*.json" | grep -E '/[0-9]{3}\.json$' | sort > CO/file_list.txt
```

2. Execute the script, passing the input and output file names as arguments:

```bash
python3 merge_ce.py CE/file_list.txt CE/all.json CE/duplicate.json CE/stat.json
python3 merge_co.py CO/file_list.txt CO/all.json CO/duplicate.json CO/stat.json
```