set -e

dir="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

rm -rf $dir/.terraform/plugin*
if [ ! -f "/tmp/tf-prov-aws/GNUmakefile" ]; then
  rm -rf /tmp/tf-prov-aws/
  git clone git@github.com:bjacobel/terraform-provider-aws.git /tmp/tf-prov-aws --depth 1 --single-branch --branch combo-9657-9337
fi;
cd /tmp/tf-prov-aws && make build 1> /dev/null
mkdir -p $dir/.terraform/plugins/darwin_amd64/
ln -sf $GOPATH/bin/terraform-provider-aws $dir/.terraform/plugins/darwin_amd64/terraform-provider-aws_v2.39.0_x4
cd $dir && terraform init --get-plugins=true
