#!/bin/bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
echo "Script is in $DIR"
cd $DIR

echo "Update to newest version"
svn update

echo "Install React frontend"
# rm -rf ./node_modules
npm install 

echo "Build React frontend"
npm run build -y

echo "Move build files to runtime path."
rm -rf /plustek/webapps/docaptures/site/*
mv ./build/* /plustek/webapps/docaptures/site/

echo "Complete."
