resource "aws_s3_bucket_object" "manifest09pdf" {
  bucket       = aws_s3_bucket.files.id
  key          = "/manifest09.pdf"
  source       = "../../data/manifests/Epstein-v-Edwards.pdf"
  content_type = "application/pdf"
}
