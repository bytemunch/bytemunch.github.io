#!/bin/bash

echo "Cleaning public folder..."
rm -rf ./docs/*

echo "Compiling TS..."
tsc

echo "Adding root files..."
rsync -a ./src/root/* ./docs/

echo "Adding hosted projects..."
rsync -a ./hosted-projects/* ./docs/projects