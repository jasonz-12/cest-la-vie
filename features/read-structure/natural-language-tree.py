import json

def create_natural_language_tree(node, parent_name=''):
    """Recursively create a natural language representation of the tree."""
    # Node name
    node_name = node['contents'].get('title') or node['contents'].get('rich_text')
    if isinstance(node_name, dict):
        node_name = node_name.get('rich_text')
    node_name = node_name or 'Unnamed Node'

    # Combine parent name with current node name
    full_name = f"{parent_name}/{node_name}" if parent_name else node_name

    # Process children
    children_descriptions = []
    if 'children' in node and node['children']:
        for child in node['children']:
            child_desc = create_natural_language_tree(child, full_name)
            children_descriptions.append(child_desc)

    # Combine current node description with its children's descriptions
    if children_descriptions:
        return f"{full_name} ({', '.join(children_descriptions)})"
    else:
        return full_name

# Load the JSON data from the file
file_path = '/Users/tbiytc/Desktop/LifeZ/cest-la-vie/mvp/features/read-structure/page-tree-structure.json'  # Replace with your file path
with open(file_path, 'r') as file:
    tree_data = json.load(file)

# Creating the natural language representation for each root-level node in the tree
natural_language_trees = [create_natural_language_tree(root_node) for root_node in tree_data]

# Combining the descriptions of all root-level nodes
natural_language_tree_description = '; '.join(natural_language_trees)

# Output the natural language tree description
print(natural_language_tree_description)
