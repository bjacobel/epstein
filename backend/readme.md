# epseinbrain/backend

This Terraform stack is using a local version of `terrafomr-provider-aws`. It won't run unless you init with this specific version, or until these two PRs are merged:

https://github.com/terraform-providers/terraform-provider-aws/pull/9657
https://github.com/terraform-providers/terraform-provider-aws/pull/9337

Yes, this sucks a lot!!

Do this:

```
brew install go
pushd terraform-provider-aws
make build
ln -ls $GOPATH/bin/terraform-provider-aws_v2.39.0_x4 $GOPATH/bin/terraform-provider-aws
popd
terraform init --plugin-dir=$GOPATH/bin/ --get-plugins=false
```
