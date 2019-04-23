#!/bin/bash
PATH=./services/*

for f in $PATH
do
    if [ -d "$f" ]
    then
        echo "Directory - $f"

        #- Run deployment for dev2 and webtesting
        # cd $f
        # yarn deploy:dev
        # yarn deploy:webtesting

        # cd ../..
    fi
done