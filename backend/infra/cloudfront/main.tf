locals {
  appsync_domain = regex("https://(.*)/graphql", var.appsync_endpoint)[0]
}

resource "aws_cloudfront_distribution" "appsync_distro" {
  origin {
    domain_name = local.appsync_domain
    origin_id   = "appsync-${local.appsync_domain}"

    custom_origin_config {
      http_port              = 80
      https_port             = 443
      origin_protocol_policy = "https-only"
      origin_ssl_protocols   = ["TLSv1.2"]
    }

    custom_header {
      name  = "x-api-key"
      value = var.origin_api_key
    }
  }

  enabled         = true
  is_ipv6_enabled = true
  http_version    = "http2"
  price_class     = "PriceClass_100"

  default_root_object = "/graphql"

  default_cache_behavior {
    target_origin_id = "appsync-${local.appsync_domain}"
    allowed_methods  = ["HEAD", "DELETE", "POST", "GET", "OPTIONS", "PUT", "PATCH"]
    cached_methods   = ["HEAD", "GET"]
    compress         = true

    forwarded_values {
      query_string = true

      cookies {
        forward = "none"
      }
    }

    viewer_protocol_policy = "redirect-to-https"
    min_ttl                = 0
    default_ttl            = 0
    max_ttl                = 0
  }

  viewer_certificate {
    cloudfront_default_certificate = true
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
