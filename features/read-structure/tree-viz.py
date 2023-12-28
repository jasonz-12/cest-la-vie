import json
from collections import defaultdict

def build_tree(elements):
    # Create a mapping of parent ID to children
    tree = defaultdict(list)
    for element in elements:
        tree[element['parent']].append(element)

    # Recursively build a tree structure
    def build_branch(parent_id):
        branch = []
        for child in tree[parent_id]:
            # Create a dictionary for each child
            child_dict = {
                'type': child['type'],
                'id': child['id'],
                'contents': child['contents'],
                'children': build_branch(child['id'])  # Recursively build child branches
            }
            branch.append(child_dict)
        return branch

    # Start building from the root (None)
    return build_branch(None)


def main():
    # Load the JSON data from a file
    file_path = './metadata-structure-template.json'  # Replace with your file path
    with open(file_path, 'r') as file:
        metadata_structure = json.load(file)

    # Build the tree structure
    tree_structure = build_tree(metadata_structure)

    # Save the tree structure to a JSON file
    output_file_path = './page-tree-structure.json'  # Replace with your desired output file path
    with open(output_file_path, 'w', encoding='utf-8') as file:
        json.dump(tree_structure, file, indent=4, ensure_ascii=False)

if __name__ == "__main__":
    main()
