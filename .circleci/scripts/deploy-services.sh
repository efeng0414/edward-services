#!/bin/bash
TARGET=./services/*

for f in $TARGET
do
    if [ -d "$f" ]
    then
        echo "Directory - $f"

        cd $f

        SERVICE_NAME=$(cat app.development.yaml | awk '/service:/ { print $2}')

        echo "Deploying service $SERVICE_NAME........."

        #- Run deployment for dev2 and webtesting

        if yarn deploy:dev
        then 
            OLD_VERSION=$(gcloud app versions list --service $SERVICE_NAME | awk '($3 -eq 0 && $5 == "STOPPED") {print $2}')

            echo "Deleting service $SERVICE_NAME version $OLD_VERSION........."

            [ ! -z "$OLD_VERSION" ] && gcloud app services delete $SERVICE_NAME --version=$OLD_VERSION --quiet
            echo "$SERVICE_NAME deployed to dev2 successfully!! 💯💯💯"
            
        else 
            echo "dev2 deployment fail: $f"
        fi

        # if yarn deploy:webtesting
        # then 
        #     OLD_VERSION=$(gcloud app versions list --service $SERVICE_NAME | awk '($3 -eq 0 && $5 == "STOPPED") {print $2}')

        #     echo "Deleting service $SERVICE_NAME version $OLD_VERSION........."

        #     [ ! -z "$OLD_VERSION" ] && gcloud app services delete $SERVICE_NAME --version=$OLD_VERSION --quiet
        #     echo "$SERVICE_NAME deployed to webtesting successfully!! 💯💯💯"
            
        # else 
        #     echo "webtesting deployment fail: $f"
        # fi

        cd ../..
    fi
done


echo "✅✅ ======= Finish deployment =========== ✅✅"