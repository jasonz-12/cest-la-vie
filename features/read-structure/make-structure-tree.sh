#!/bin/bash

echo $(pwd)
echo "Processing structure."
node retrieve-structure.js
echo "Structure processing completed, visualizing tree."
python3 tree-viz.py
