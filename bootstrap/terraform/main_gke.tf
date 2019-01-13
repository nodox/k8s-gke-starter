# Authenticate to GCP
provider "google" {
    credentials = "${file("gcp_gke_credentials.json")}"
    project     = "dennys-221918"
    region      = "us-east4"
}

# GKE Cluster
resource "google_container_cluster" "primary" {
  name               = "dr-wallace-burger"
  zone               = "us-east4-a"
  initial_node_count = 2

  additional_zones = [
    "us-east4-b",
    "us-east4-c",
  ]

  master_auth {
    username = "runner"
    password = "deadass__weinhereyouheard"
  }

  node_config {
    oauth_scopes = [
      "https://www.googleapis.com/auth/compute",
      "https://www.googleapis.com/auth/devstorage.read_only",
      "https://www.googleapis.com/auth/logging.write",
      "https://www.googleapis.com/auth/monitoring",
    ]

    labels {
      foo = "bar"
    }

    tags = ["foo", "bar"]
  }
}

# The following outputs allow authentication and connectivity to the GKE Cluster.
output "client_certificate" {
  value = "${google_container_cluster.primary.master_auth.0.client_certificate}"
}

output "client_key" {
  value = "${google_container_cluster.primary.master_auth.0.client_key}"
}

output "cluster_ca_certificate" {
  value = "${google_container_cluster.primary.master_auth.0.cluster_ca_certificate}"
}