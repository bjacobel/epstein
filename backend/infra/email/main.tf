data "aws_region" "current" {}

data "aws_route53_zone" "hosted_zone" {
  name = "${var.domain}."
}

resource "aws_route53_record" "cname_verification" {
  zone_id = data.aws_route53_zone.hosted_zone.id
  name    = "467uzpm77sa5.${var.domain}."
  type    = "CNAME"
  ttl     = "600"
  records = ["gv-o6i2woorr5wfqd.dv.googlehosted.com"]
}

resource "aws_route53_record" "google_mx" {
  zone_id = data.aws_route53_zone.hosted_zone.id
  name    = "${var.domain}."
  type    = "MX"
  ttl     = "600"
  records = [
    "1 ASPMX.L.GOOGLE.COM.",
    "5 ALT1.ASPMX.L.GOOGLE.COM.",
    "5 ALT2.ASPMX.L.GOOGLE.COM.",
    "10 ASPMX2.GOOGLEMAIL.COM.",
    "10 ASPMX3.GOOGLEMAIL.COM.",
  ]
}
