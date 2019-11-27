SHELL := /bin/bash

.PHONY: deploy

init:
	@rm -rf infra/.terraform/plugin*
	@cd infra/terraform-provider-aws && make build
	@mkdir -p infra/.terraform/plugins/darwin_amd64/
	@GOPATH='$(GOPATH)'; ln -sf $${GOPATH}/bin/terraform-provider-aws infra/.terraform/plugins/darwin_amd64/terraform-provider-aws_v2.39.0_x4
	@cd infra && terraform init --get-plugins=true

apply:
	@cd infra && terraform apply

refresh:
	@cd infra && terraform refresh

upload-schema:
	@cd schema && \
		yarn --silent upload \
		`terraform output -state ../infra/terraform.tfstate -json | jq -er ".api_id.value"` \
		`terraform output -state ../infra/terraform.tfstate -json | jq -er ".region.value.name"`

deploy: apply upload-schema
