provider "google" {
  project = var.project_id
  region  = var.region
}

# 🔹 Create Artifact Registry for storing container images
resource "google_artifact_registry_repository" "nodejs_repo" {
  location      = var.region
  repository_id = var.repo_name
  format        = "DOCKER"
}

# 🔹 Build & Push Docker Image LOCALLY
# resource "null_resource" "build_and_push_1" {
#   provisioner "local-exec" {
#     command = <<EOT
#       # Authenticate Docker with Google Artifact Registry
#       gcloud auth configure-docker ${var.region}-docker.pkg.dev
#     EOT
#   }
# }

# 🔹 Build & Push Docker Image LOCALLY
resource "null_resource" "build_and_push_2" {
  # depends_on = [ null_resource.build_and_push_1 ]
  provisioner "local-exec" {
    command = <<EOT
      # Navigate to the project directory
      cd ${var.local_project_path}
    EOT
  }
}

# 🔹 Build & Push Docker Image LOCALLY
resource "null_resource" "build_and_push_3" {
  depends_on = [ null_resource.build_and_push_2 ]
  provisioner "local-exec" {
    command = <<EOT
      # Build Docker image
      docker build -t ${var.image_url} .
    EOT
  }
}

# 🔹 Build & Push Docker Image LOCALLY
resource "null_resource" "build_and_push_4" {
  depends_on = [ null_resource.build_and_push_3 ]
  provisioner "local-exec" {
    command = <<EOT
      # Push Docker image to Artifact Registry
      docker push ${var.image_url}
    EOT
  }
}

# 🔹 Deploy Cloud Run Service
resource "google_cloud_run_service" "nodejs_service" {
  depends_on = [null_resource.build_and_push_4]

  name     = var.service_name
  location = var.region

  template {
    spec {
      containers {
        image = var.image_url
        ports {
          container_port = 8080
        }
        resources {
          limits = {
            cpu    = "1000m"
            memory = "512Mi"
          }
        }
      }
    }
  }

  traffic {
    percent         = 100
    latest_revision = true
  }
}

# 🔹 Allow Public Access to Cloud Run
resource "google_cloud_run_service_iam_policy" "public_access" {
  location = google_cloud_run_service.nodejs_service.location
  service  = google_cloud_run_service.nodejs_service.name

  policy_data = <<EOF
{
  "bindings": [
    {
      "role": "roles/run.invoker",
      "members": ["allUsers"]
    }
  ]
}
EOF
}

# # 🔹 Output the Cloud Run URL
# output "cloud_run_url" {
#   value = google_cloud_run_service.nodejs_service.status[0].url
# }
