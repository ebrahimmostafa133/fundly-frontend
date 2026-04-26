#!/bin/bash
set -e

BUCKET_NAME="fundly-frontend-benzema-1777189879"
REGION="us-east-1"

echo "Building React app..."
npm run build

echo "Uploading files to S3..."
aws s3 sync dist/ "s3://$BUCKET_NAME" --delete

echo "====================================================="
echo "Deployment Complete!"
echo "Your website URL is:"
echo "http://$BUCKET_NAME.s3-website-$REGION.amazonaws.com"
echo "====================================================="
