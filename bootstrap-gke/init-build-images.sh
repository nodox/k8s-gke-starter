#!/bin/bash
PROJECT_ID=dennys-221918
IMAGE_NAME=express-app_server

docker build -t $IMAGE_NAME:v1 ./express-app-v1
docker build -t $IMAGE_NAME:v2 ./express-app-v2

docker push us.gcr.io/$PROJECT_ID/$IMAGE_NAME:v1
docker push us.gcr.io/$PROJECT_ID/$IMAGE_NAME:v2