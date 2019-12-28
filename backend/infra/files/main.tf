resource "aws_s3_bucket" "files" {
  bucket = "epsteinbrain-static-files"

  tags = {
    Project = var.name
  }
}

resource "aws_s3_bucket_policy" "files_policy" {
  bucket = aws_s3_bucket.files.id

  policy = <<POLICY
{
    "Version": "2012-10-17",
    "Id": "allow-files-access",
    "Statement": [
        {
            "Sid": "allow-files-access",
            "Effect": "Allow",
            "Principal": "*",
            "Action": "s3:GetObject",
            "Resource": "arn:aws:s3:::${aws_s3_bucket.files.id}/*"
        }
    ]
}
POLICY
}

resource "aws_cloudfront_origin_access_identity" "default" {}

resource "aws_cloudfront_distribution" "files_distro" {
  origin {
    domain_name = aws_s3_bucket.files.bucket_regional_domain_name
    origin_id   = "s3-${var.name}"

    s3_origin_config {
      origin_access_identity = aws_cloudfront_origin_access_identity.default.cloudfront_access_identity_path
    }
  }

  aliases = [
    "files.${var.domain}"
  ]

  enabled         = true
  is_ipv6_enabled = true
  http_version    = "http2"
  price_class     = "PriceClass_100"

  default_cache_behavior {
    target_origin_id = "s3-${var.name}"
    allowed_methods  = ["HEAD", "DELETE", "POST", "GET", "OPTIONS", "PUT", "PATCH"]
    cached_methods   = ["HEAD", "GET"]
    compress         = true

    forwarded_values {
      query_string = false

      cookies {
        forward = "none"
      }
    }

    viewer_protocol_policy = "redirect-to-https"
    min_ttl                = 31536000
    default_ttl            = 31536000
    max_ttl                = 31536000
  }

  viewer_certificate {
    acm_certificate_arn = data.aws_acm_certificate.cert.arn
    ssl_support_method  = "sni-only"
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  tags = {
    Project = var.name
  }

  wait_for_deployment = false
}

data "aws_route53_zone" "hosted_zone" {
  name = "${var.domain}."
}

data "aws_acm_certificate" "cert" {
  domain      = var.domain
  types       = ["AMAZON_ISSUED"]
  most_recent = true
}

resource "aws_route53_record" "www" {
  zone_id = "${data.aws_route53_zone.hosted_zone.zone_id}"
  name    = "files.${data.aws_route53_zone.hosted_zone.name}"
  type    = "A"
  ttl     = "60"

  alias = {
    name    = aws_cloudfront_distribution.files_distro.domain_name
    zone_id = "Z2FDTNDATAQYW2"
  }
}
