variable "project_id" {
  description = "GCP Project ID"
  type        = string
  default = "seallm-451303"
}

variable "region" {
  description = "GCP Region"
  type        = string
  default     = "us-central1"
}

variable "repo_name" {
  description = "Name of the Artifact Registry Repository"
  type        = string
  default     = "my-node-repo"
}

variable "service_name" {
  description = "Name of the Cloud Run Service"
  type        = string
  default     = "nodejs-cloud-run"
}

variable "container_tag" {
  description = "Tag for the Docker Image"
  type        = string
  default     = "latest"
}

variable "local_project_path" {
  description = "Path to the local Node.js project"
  type        = string
  default     = "./"
}

variable "image_url" {
  description = "Full image path in Artifact Registry"
  type        = string
  default     = "us-central1-docker.pkg.dev/my-gcp-project/my-node-repo/nodejs-cloud-run:latest"
}
