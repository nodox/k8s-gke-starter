#!/bin/bash
docker build -t express-app_server:v1 ./express-app-v1
docker build -t express-app_server:v2 ./express-app-v2

docker push us.gcr.io/dennys-221918/express-app_server:v1
docker push us.gcr.io/dennys-221918/express-app_server:v2