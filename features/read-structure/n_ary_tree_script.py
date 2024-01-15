import json

def summarize_node(node, depth=0, max_depth=2):
    """Summarize a node in the tree, showing its type, a snippet of its content, and its children (up to a certain depth)."""
    indent = '  ' * depth
    node_summary = f"{indent}- Type: {node['type']}, ID: {node['id']}"
    
    # Add a snippet of content if available
    if 'contents' in node and node['contents']:
        content = node['contents'].get('title') or node['contents'].get('rich_text') or '[Content]'
        if isinstance(content, dict):
            content = content.get('rich_text') or '[Content]'
        node_summary += f", Content: {content[:30]}"  # Show only first 30 characters for brevity

    # Process children if they exist, but only up to the specified depth
    children_summary = ''
    if depth < max_depth and 'children' in node and node['children']:
        children_summary = '\n'.join([summarize_node(child, depth + 1, max_depth) for child in node['children']])

    return f"{node_summary}\n{children_summary}"

def summarize_nodes(nodes, depth=0, max_depth=5):
    """Summarize a list of nodes in the tree."""
    summaries = []
    for node in nodes:
        node_summary = summarize_node(node, depth, max_depth)
        summaries.append(node_summary)
    return '\n'.join(summaries)

# Load the JSON data
file_path = '/Users/tbiytc/Desktop/LifeZ/cest-la-vie/mvp/features/read-structure/page-tree-structure.json'
with open(file_path, 'r') as file:
    data = json.load(file)

# Summarize each root-level node in the data
tree_summaries = summarize_nodes(data)

# Print a part of the summary to provide a glimpse of the structure without overwhelming detail
print(tree_summaries)  # Adjust the slicing as needed
