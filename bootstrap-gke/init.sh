#!/bin/bash
CLUSTER_NAME=dr-wallace-burger

# create the cluster with container
docker build -t bootstrap_gke:v1 ./bootstrap-gke
docker run bootstrap_gke:v1

# authenticate the machine with cluster
gcloud container clusters get-credentials $CLUSTER_NAME

# push to images to image repository for the cluster
./bootstrap-gke/init-build-images.sh

# create a 3 pod ReplicatSet using a Deployment resource
kubectl apply -f ./bootstrap-gke/gke_deployment.yaml

# create a Service resrouces
kubectl apply -f ./bootstrap-gke/gke_service.yaml

# allow external traffic to cluster via service
gcloud compute firewall-rules create test-node-port --allow tcp:$(kubectl get svc express-app --output jsonpath="{.spec.ports[0].nodePort}")

# get public endpoint to cluster
URL=$(kubectl get nodes --output jsonpath="{.items[0].status.addresses[1].address}")
PORT=$(kubectl get svc express-app --output jsonpath="{.spec.ports[0].nodePort}")
echo http://$URL:$PORT