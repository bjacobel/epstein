provider "aws" {
  region  = "us-east-2"
  version = "~> 2.39"
}

resource "aws_vpc" "vpc" {
  cidr_block           = "172.31.0.0/16"
  enable_dns_hostnames = true
  enable_dns_support   = true

  tags = {
    Project = var.name
  }
}

resource "aws_internet_gateway" "gw" {
  vpc_id = aws_vpc.vpc.id

  tags = {
    Project = var.name
  }
}

data "aws_availability_zones" "azs" {}

resource "aws_subnet" "subnets" {
  count                   = length(data.aws_availability_zones.azs.names)
  cidr_block              = cidrsubnet(aws_vpc.vpc.cidr_block, 8, count.index)
  availability_zone       = data.aws_availability_zones.azs.names[count.index]
  vpc_id                  = aws_vpc.vpc.id
  map_public_ip_on_launch = true

  depends_on = [aws_internet_gateway.gw]

  lifecycle {
    ignore_changes = [tags]
  }

  tags = {
    Project = var.name
  }
}

resource "aws_default_route_table" "r" {
  default_route_table_id = aws_vpc.vpc.default_route_table_id

  tags = {
    Project = var.name
  }
}
resource "aws_route_table_association" "route_ass" {
  count          = length(data.aws_availability_zones.azs.names)
  subnet_id      = element(aws_subnet.subnets.*.id, count.index)
  route_table_id = aws_default_route_table.r.id
}

resource "aws_default_vpc_dhcp_options" "default" {
  tags = {
    Project = var.name
  }
}

resource "aws_vpc_dhcp_options_association" "dns_resolver" {
  vpc_id          = aws_vpc.vpc.id
  dhcp_options_id = aws_default_vpc_dhcp_options.default.id
}

resource "aws_default_network_acl" "default" {
  default_network_acl_id = aws_vpc.vpc.default_network_acl_id
  subnet_ids             = aws_subnet.subnets.*.id

  ingress {
    protocol   = -1
    rule_no    = 100
    action     = "allow"
    cidr_block = "0.0.0.0/0"
    from_port  = 0
    to_port    = 0
  }

  egress {
    protocol   = -1
    rule_no    = 100
    action     = "allow"
    cidr_block = "0.0.0.0/0"
    from_port  = 0
    to_port    = 0
  }

  tags = {
    Project = var.name
  }
}

module "rds" {
  name       = var.name
  source     = "./rds"
  vpc_id     = aws_vpc.vpc.id
  subnet_ids = aws_subnet.subnets.*.id
  username   = "rds"

  // @TODO make secure -- although the SGs *should* never let anyone get this far
  password = "password"
}

module "appsync" {
  name                         = var.name
  source                       = "./appsync"
  rds_cluster_id               = module.rds.rds_cluster_id
  rds_cluster_arn              = module.rds.rds_cluster_arn
  rds_cluster_db_name          = module.rds.rds_cluster_db_name
  rds_cluster_secret_store_arn = module.rds.rds_cluster_secret_store_arn
}
