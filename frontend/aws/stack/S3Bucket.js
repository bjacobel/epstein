const { ref, join } = require('@mapbox/cloudfriend');

module.exports = {
  Type: 'AWS::S3::Bucket',
  Properties: {
    BucketName: join([ref('ProjectFQDomain'), '.prime']),
    AccessControl: 'PublicRead',
    VersioningConfiguration: {
      Status: 'Suspended',
    },
  },
};
