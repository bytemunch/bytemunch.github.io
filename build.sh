#!/bin/bash

echo "Cleaning public folder..."
rm -rf ./docs/*

echo "Compiling TS..."
tsc

rsync -a ./src/ts/components/*.html ./docs/js/components/
rsync -a ./src/ts/components/*.css ./docs/js/components/

echo "Adding root files..."
rsync -a ./src/root/* ./docs/

echo "Adding hosted projects..."
rsync -a ./hosted-projects/* ./docs/projects

# echo "Adding blog..."
# rsync -a ./src/posts/* ./docs/posts/