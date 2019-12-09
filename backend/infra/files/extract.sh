mkdir -p /tmp/${name}/ && \
pdfimages -png ${pdf} /tmp/${name}/page && \
mogrify -rotate "${rotation}" /tmp/${name}/page-*.png
aws s3 sync /tmp/${name} s3://${bucket}/${name}/ --content-type 'image/png' --metadata-directive REPLACE
