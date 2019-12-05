SHELL := /bin/bash

.PHONY: deploy

init:
	@rm -rf infra/.terraform/plugin*
	@git clone git@github.com:bjacobel/terraform-provider-aws.git /tmp/tf-prov-aws --depth 1 --single-branch --branch combo-9657-9337 2> /dev/null || true
	@cd /tmp/tf-prov-aws && make build 1> /dev/null
	@mkdir -p infra/.terraform/plugins/darwin_amd64/
	@GOPATH='$(GOPATH)'; ln -sf $${GOPATH}/bin/terraform-provider-aws infra/.terraform/plugins/darwin_amd64/terraform-provider-aws_v2.39.0_x4
	@cd infra && terraform init --get-plugins=true

apply:
	@cd infra && terraform apply

refresh:
	@cd infra && terraform refresh

plan:
	@cd infra && terraform plan

upload-schema:
	@cd schema && \
		yarn --silent upload \
		`terraform output -state ../infra/terraform.tfstate -json | jq -er ".api_id.value"` \
		`terraform output -state ../infra/terraform.tfstate -json | jq -er ".region.value"`

deploy: upload-schema apply
