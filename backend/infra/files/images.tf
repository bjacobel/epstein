resource "null_resource" "manifest09" {
  provisioner "local-exec" {
    working_dir = "../../data/manifests"
    command     = <<HERE
mkdir -p /tmp/manifest09-images/ && \
pdfimages -png Epstein-v-Edwards.pdf /tmp/manifest09-images/page
HERE
  }
}

resource "aws_s3_bucket_object" "manifest09" {
  for_each     = fileset("/tmp/manifest09-images/", "*.png")
  bucket       = aws_s3_bucket.files.id
  key          = "/manifest09/${basename(each.value)}"
  source       = "/tmp/manifest09-images/${each.value}"
  content_type = "image/png"

  depends_on = [
    null_resource.manifest09
  ]
}
