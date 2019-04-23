#!/bin/bash
PATH=./services/*

for f in $PATH
do
    if [ -d "$f" ]
    then
        echo "Directory - $f"

        cd $f

        #- Create .env file in each folder
        # name: "Restore Env Variables"
        # command: cp ../../.env.development ..env.development
        # command: cp ../../.env.webTesting ..env.webTesting

        #- Install Npm Package for each directory
        # yarn

        pwd

        cd ../..
    fi
done