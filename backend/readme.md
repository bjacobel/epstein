# epseinbrain/backend

The Terraform stack in `infrastructure/` is using a fork of `terraform-provider-aws`. It won't run unless you init with [this specific version](https://github.com/bjacobel/terraform-provider-aws/tree/combo-9657-9337), or until these two PRs are merged:

https://github.com/terraform-providers/terraform-provider-aws/pull/9657
https://github.com/terraform-providers/terraform-provider-aws/pull/9337

Yes, this sucks a lot!! But the Makefile will help you with it - just run `make init` to pull and build the required plugin versions locally, then install them.
