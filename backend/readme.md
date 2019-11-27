# epseinbrain/backend

The Terraform stack in `infrastructure/` is using a local version of `terraform-provider-aws`. It won't run unless you init with this specific version, or until these two PRs are merged:

https://github.com/terraform-providers/terraform-provider-aws/pull/9657
https://github.com/terraform-providers/terraform-provider-aws/pull/9337

Yes, this sucks a lot!! But the Makefile will help you with it - just run `make init` to build the required plugin versions locally and install them.
