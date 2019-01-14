# Kubernetes Deployment Strategy
Here is the zero-downtime deploy script with Kubernetes.

## Demo
- Watch the video `demo.mov` to see the cli script in action.

## Getting Started
For this project you will need to create a cluster as described in the prompt on GKE.

### Requirements
A running kubernetes cluster, for this example it'll be on GKE. The final cluster will have a 3 pod ReplicaSet created via a Deployment resource, fronted by a Service resource. The public endpoints are exposed via a Nodeport instead of a loadbalancer.

- Use these instructions [here](https://cloud.google.com/sdk/docs/quickstart-macos), to get gcloud set up on your machine.

- Signup a GCP account [here](https://cloud.google.com/). Follow the quickstart guide [here](https://cloud.google.com/kubernetes-engine/docs/quickstart), to get autenticated with your gcloud account. You will need to do this so you can push the example docker images to GCR.

- Create new service-account credentials with the role `Owner` using this [link](https://console.cloud.google.com/apis/credentials). Rename the credentials to `gke_credentials.json`. Place the credentials in `./bootstrap-gke` directory. The credentials all the docker container in `bootstrap-gke` to create a cluster.

### Create the GKE cluster
Run the follow commands to create a our cluster with 3 pods, fronted by a Service.

```
./bootstrap-gke/init.sh
```

You can visit the url above to see the live application.
You should see a json response that reads `status:up`.

### Using the cli
Now that the service is up and running. You can run the following commands to trigger a deployment.

```
cd cli
```

```
node index.js deploy us.gcr.io/dennys-221918/express-app_server:v1 us.gcr.io/dennys-221918/express-app_server:v2
```

You will see the status message change to `status:down` without any downtime.


## Reflections and Areas of Improvement
Here are some thoughts about the code I've written and building the cluster.

### CLI
The goal was a achieved but practically I am not a fan for hacking together scripts to deploy individual applications. For this I would prefer to keep it in CD or use a tool like Flux operation and let the operator determine when a change is made that merits a deploy.

The cli could use a lot of work. I'm not a huge fan of spinning up subprocess in live shells to execute the `kubectl` commands. Here I would've preferred to use the Javascript client libraries to talk to the kubernetes API. 

A lot of the commands block the runtime event loop which is not ideal. However it was ok, because we needed these tasks to run in sequence. I would prefer to use better async handling or even another language if Node is not the right fit for the task.

There is a ton of things that are hardcoded: app name, project name, image url, and the path to the cli command. The goal would be to refactor those things to be more dynamic. Right now its hard to make the cli functionality general. After completing that cli, I realized a better option would have been to download the current Deployment to memory, make the modifications, and then apply the changes. Those files have a high change of going stale

### GKE
I found this task hard to complete without an actual cluster so I made one in GKE. I chose GKE because I already had a project using Docker to create a GKE cluster from within a container. I would prefer to have everything run in Docker as it makes running these commands easier on any machine, including within CI. I apologize in advance if you are not able to run the example but included the demo video to demonstrate how possible it could be.
