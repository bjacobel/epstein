output "rds_cluster_id" {
  value = aws_rds_cluster.rds_db.id
}

output "rds_cluster_arn" {
  value = aws_rds_cluster.rds_db.arn
}

output "rds_cluster_db_name" {
  value = aws_rds_cluster.rds_db.database_name
}

output "rds_cluster_secret_store_arn" {
  value = aws_secretsmanager_secret_version.rds_creds.arn
}
