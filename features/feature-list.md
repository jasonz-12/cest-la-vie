# read-structure

## Description
* This feature is to read and organize the hierarchies (if any) for any give page/database/block.
* The goal of this feature is to ensure that no matter how much the structure changes we always know how to trace them back.
  
## Usage
* Execute the `./read-structure/retrieve-structure.js` program to generate a list of blocks and save them into `./read-structure/metadata-structure.json`
* Use `./read-structure/tree-viz.py` to help us link the hierarchies together via the `parent` key for each and every block.

## Improvements Needed
* Dynamically handle pagination when the number of records in a database exceeds 100.
* Include more metadata such as the title, or maybe the first 100 characters.
* Save this somewhere on the Notion template as well to make sure that it is traceable.
* Potentially use a more efficient tree structure.