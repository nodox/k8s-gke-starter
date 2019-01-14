#!/bin/bash
PROJECT_ID=dennys-221918
REGION=us-east4-a
CREDENTIALS=gke_credentials.json
CLUSTER_NAME=dr-wallace-burger

terraform init
terraform apply  --auto-approve

# configure project
# TODO: remove hardcoded project
# TODO: remove hardcoded zone
gcloud auth activate-service-account --key-file ./$CREDENTIALS

gcloud config set project $PROJECT_ID \
    && gcloud config set compute/zone $REGION

# get credentials cluster for container
# TODO remove hardcoded cluster name
gcloud container clusters get-credentials $CLUSTER_NAME
