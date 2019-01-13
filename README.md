# Kubernetes Deployment Strategy
Here is the zero-downtime deploy script with Kubernetes.

## Commands
- Assumes docker image is in local disk/CI image repository and authenticated to push to
    docker build -t express-app_server:latest express-app
    docker tag express-app_server:latest us.gcr.io/dennys-221918/express-app_server:v1
    docker push us.gcr.io/dennys-221918/express-app_server:v1
    docker pull us.gcr.io/dennys-221918/express-app_server:v1
- using nodeport instead of loadbalancer
- create a firewall rule to expose nodeport (no loadbalancer)
    https://cloud.google.com/kubernetes-engine/docs/how-to/exposing-apps#creating_a_service_of_type_nodeport
    gcloud compute firewall-rules create test-node-port --allow tcp:30097
- delete firewall rules
    gcloud compute firewall-rules delete test-node-port

# Corners Cut
- Hardcorded cluster name in Dockerfile and Terraform file


## References
https://github.com/ContainerSolutions/k8s-deployment-strategies/tree/master/canary
https://www.ianlewis.org/en/bluegreen-deployments-kubernetes
https://codefresh.io/kubernetes-tutorial/blue-green-deploy/


## Requirements
- needs two images already present in a gcr container or can pull from public docker repo!