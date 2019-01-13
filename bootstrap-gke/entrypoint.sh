#!/bin/bash
terraform init
terraform apply  --auto-approve

# configure project
# TODO: remove hardcoded project
# TODO: remove hardcoded zone
gcloud auth activate-service-account --key-file ./gke_credentials.json

gcloud config set project dennys-221918 \
    && gcloud config set compute/zone us-east4-a 

# get credentials cluster for container
# TODO remove hardcoded cluster name
gcloud container clusters get-credentials dr-wallace-burger

kubectl
