terraform {
  backend "s3" {
    bucket = "epsteinbrain-tfstate"
    key    = "backend-state"
    region = "us-east-2"
  }
}

resource "aws_s3_bucket" "state_storage" {
  bucket = "epsteinbrain-tfstate"

  versioning {
    enabled = true
  }

  lifecycle {
    prevent_destroy = true
  }

  tags = {
    Project = var.name
  }
}
