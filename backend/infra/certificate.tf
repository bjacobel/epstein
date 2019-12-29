# The wildcard ACM certificate was created by Cloudformation in the frontend stack.data
# It had to be made in us-east-1 for Reasons.
# This data resource finds the cert and makes its ARN available to modules.

provider "aws" {
  alias  = "virginia"
  region = "us-east-1"
}

data "aws_acm_certificate" "cert" {
  provider    = aws.virginia
  domain      = var.domain
  types       = ["AMAZON_ISSUED"]
  most_recent = true
}
