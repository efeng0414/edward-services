#!/bin/bash
PATH=./services/*

for f in $PATH
do
    if [ -d "$f" ]
    then
        echo "Directory - $f"

        cd $f

        SERVICE_NAME=$(cat app.development.yaml | awk '/service:/ { print $2}')

        #- Run deployment for dev2 and webtesting

        if yarn deploy:dev
        then 
            OLD_VERSION=$(gcloud app versions list --service email-test | awk '($3 -eq 0 && $5 == "STOPPED") {print $2}')
            gcloud app services delete $SERVICE_NAME --version=$OLD_VERSION
        else 
            echo "dev2 deployment fail: $f"
        fi

        if yarn deploy:webtesting
        then 
            OLD_VERSION=$(gcloud app versions list --service email-test | awk '($3 -eq 0 && $5 == "STOPPED") {print $2}')
            gcloud app services delete $SERVICE_NAME --version=$OLD_VERSION
        else 
            echo "webtesting deployment fail: $f"
        fi

        cd ../..
    fi
done