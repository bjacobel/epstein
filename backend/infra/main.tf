provider "aws" {
  region  = "us-east-2"
  version = "2.39"
}

provider "template" {
  version = "~> 2.1"
}

module "rds" {
  name       = var.name
  source     = "./rds"
  vpc_id     = aws_vpc.vpc.id
  subnet_ids = aws_subnet.subnets.*.id
  username   = "rds"

  // Obviously not secure. Shouldn't matter because the SGs *should* never let anyone get this far.
  // In theory, the only thing that can even hit this DB is AppSync.
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

module "cloudfront" {
  name             = var.name
  source           = "./cloudfront"
  vpc_id           = aws_vpc.vpc.id
  appsync_endpoint = module.appsync.endpoint
  origin_api_key   = module.appsync.api_key
}
