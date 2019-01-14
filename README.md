# Kubernetes Deployment Strategy
Here is the zero-downtime deploy script with Kubernetes.

## Demo
Watch the video `demo-blue-green.mov` to see the cli script in action.

## Getting Started
For this project you will need to create a cluster.

### Requirements
We need a running kubernetes cluster. For this example it'll be on GKE. The cluster will have a 3 pod ReplicaSet created via a Deployment resource, fronted by a Service. The public endpoints are exposed via a Nodeport instead of a loadbalancer.

- Sign up for a GCP account [here](https://cloud.google.com/).

- Use these instructions [here](https://cloud.google.com/sdk/docs/quickstart-macos), to get gcloud set up on your machine.

- Follow the quickstart guide [here](https://cloud.google.com/kubernetes-engine/docs/quickstart), to get authenticated with your gcloud account and the cluster. You will need to do this so you can push the example docker images to GCR.

- Create new a service-account credentials with the role `Owner` using this [link](https://console.cloud.google.com/apis/credentials). Rename the credentials to `gke_credentials.json`. Place the credentials in `./bootstrap-gke` directory. The credentials allow the container in `bootstrap-gke/Dockerfile` to create a cluster.

### Create the GKE cluster
Run the following commands to create the cluster.

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

The script works by creating the new Deployment resource with the new image parameter, and changing the label on the Service [here](https://github.com/nodox/k8s-gke-starter/blob/master/cli/infra/service.json#L21) to point to the new version of the image. The old deployment is deleted once the rollout is complete. By keeping both Deployments live, and then swapping over the Service selector labels, you are able to achieve zero-down time rollouts.


## Reflections and Areas of Improvement
Here are some thoughts about the code I've written and building the cluster.

### CLI
The goal was achieved but practically I am not a fan of hacking together scripts to deploy custom applications. For this I would prefer to keep it in CD or use a tool like Flux operator, or Helm, and let those tools determine when a change is made that merits a deploy.

The cli could use a lot of work. I'm not a fan of spinning up subprocesses in live shells to execute the `kubectl` commands. The could be some security risks. Here I would've preferred to use the Javascript client libraries to talk to the kubernetes API. 

A lot of the commands block the runtime event loop which is not ideal. However it was ok, because we need these tasks to run in sequence. I would prefer to use better async handling or even another language if Node is not the right fit for the task.

There is a ton of things that are hardcoded: app name, project name, image url, and the path to the cli command. The goal would be to refactor those things to be more dynamic. After completing that cli, I realized a better option would have been to download the current Deployment to memory, make the modifications, and then apply the changes. This change would allow us not to have those static files in the `cli/infra/` directory. Those files have a high chance of going stale.

Finally, where are the tests!? I could not get to them. But I structured the code such that some of the testable components are not in the main cli file `index.js`. Now we can write individual unit tests on the two functions that modify the Deployment and Service resources, to make sure they make the proper changes.

### GKE
I found this task hard to complete without an actual cluster so I made one in GKE. I chose GKE because I already had a project using Docker to create a GKE cluster from within a container. But you can easily use Terraform to create an AWS cluster. 

I would prefer to have everything run in Docker as it makes running these commands easier on any machine. I apologize in advance if you are not able to run the example but included the demo video to demonstrate it works.

### Bash scripts
Not a fan of having a bunch of bash scripts laying around. If teams are not careful you can get into a habit of creating these patch scripts that are not testable.

