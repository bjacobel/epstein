resource "null_resource" "manifest09" {
  triggers = {
    script = file("${path.module}/extract.sh")
  }

  provisioner "local-exec" {
    working_dir = "../../data/manifests"
    command = templatefile("${path.module}/extract.sh", {
      name : "manifest09",
      pdf : "Epstein-v-Edwards.pdf",
      bucket : aws_s3_bucket.files.id,
      rotation : 270
    })
  }
}
