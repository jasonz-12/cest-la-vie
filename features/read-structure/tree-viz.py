import json
from collections import defaultdict

def build_tree(elements):
    # Create a mapping of parent ID to children
    tree = defaultdict(list)
    for element in elements:
        tree[element['parent']].append(element)
    
    # Recursively build a tree structure
    def build_branch(parent_id, depth=0):
        branch = []
        for child in tree[parent_id]:
            branch_str = "  " * depth + f"- {child['type']} (ID: {child['id']}) (Contents: {child['contents']})"
            branch.append(branch_str)
            # Recursively build child branches
            branch.extend(build_branch(child['id'], depth + 1))
        return branch

    # Start building from the root (None)
    return build_branch(None)

def main():
    # Load the JSON data from a file
    file_path = './metadata-structure.json'  # Replace with your file path
    with open(file_path, 'r') as file:
        metadata_structure = json.load(file)

    # Build and print the tree structure
    tree_structure = build_tree(metadata_structure)
    for line in tree_structure:
        print(line)

if __name__ == "__main__":
    main()
