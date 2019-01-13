# Receipe to deploy gke cluster
FROM ubuntu:xenial

RUN  apt-get update -y && \
     apt-get upgrade -y && \
     apt-get dist-upgrade -y && \
     apt-get -y autoremove && \
     apt-get clean

RUN apt-get install -y \
    lsb-release \
    unzip \
    wget \
    curl

## Install kubectl
# https://kubernetes.io/docs/tasks/tools/install-kubectl/#install-kubectl
RUN apt-get update \
    && apt-get install -y apt-transport-https \
    && curl -s https://packages.cloud.google.com/apt/doc/apt-key.gpg | apt-key add - \
    && echo "deb https://apt.kubernetes.io/ kubernetes-xenial main" | tee -a /etc/apt/sources.list.d/kubernetes.list \
    && apt-get update \
    && apt-get install -y kubectl

## Install helm
# https://cloud.google.com/sdk/docs/quickstart-debian-ubuntu
RUN curl https://raw.githubusercontent.com/helm/helm/master/scripts/get | bash

## Install gcloud
# https://cloud.google.com/sdk/docs/quickstart-debian-ubuntu
RUN export CLOUD_SDK_REPO="cloud-sdk-$(lsb_release -c -s)" && \
    echo "deb http://packages.cloud.google.com/apt $CLOUD_SDK_REPO main" | tee -a /etc/apt/sources.list.d/google-cloud-sdk.list && \
    curl https://packages.cloud.google.com/apt/doc/apt-key.gpg | apt-key add - && \
    apt-get update -y && apt-get install google-cloud-sdk -y

## Install terraform
RUN wget https://releases.hashicorp.com/terraform/0.11.10/terraform_0.11.10_linux_amd64.zip \
    && unzip terraform_0.11.10_linux_amd64.zip \
    && mv terraform /usr/local/bin/

COPY ./terraform/main_gke.tf \
     ./

## Authenticate gcloud
COPY ./terraform/gcp_gke_credentials.json .

RUN gcloud auth activate-service-account --key-file ./gcp_gke_credentials.json

## Create gke cluster
RUN terraform init \
    && terraform apply --auto-approve

## Initialize helm 
RUN gcloud config set project dennys-221918 \
    && gcloud config set compute/zone us-east4-a 

COPY ./terraform/rbac-config.yaml .

RUN gcloud container clusters get-credentials dr-wallace-burger \
    && kubectl create serviceaccount tiller --namespace kube-system \
    && kubectl apply -f rbac-config.yaml \
    && helm init --service-account tiller --wait \
    && helm repo update


## Destroy gke cluster
# RUN terraform destroy --auto-approve
    
CMD [ "ls" ]