@echo off
git add .
git commit -m %1
git push --prune -f -u origin master