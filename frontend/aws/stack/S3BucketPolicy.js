const { ref, join } = require('@mapbox/cloudfriend');

module.exports = {
  Type: 'AWS::S3::BucketPolicy',
  Properties: {
    Bucket: join([ref('ProjectFQDomain'), '.prime']),
    PolicyDocument: {
      Version: '2012-10-17',
      Id: 'Policy1453859091536',
      Statement: [
        {
          Sid: 'Stmt1453859083693',
          Effect: 'Allow',
          Principal: '*',
          Action: 's3:GetObject',
          Resource: join([
            'arn:aws:s3:::',
            join([ref('ProjectFQDomain'), '.prime']),
            '/*',
          ]),
        },
      ],
    },
  },
};
