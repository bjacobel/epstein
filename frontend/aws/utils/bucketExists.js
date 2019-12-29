const AWS = require('aws-sdk');

const config = require('../../config');

module.exports = () => {
  const s3 = new AWS.S3({
    region: config.Region,
  });
  // Had to rename bucket to epstein.flights.prime due to region change
  return s3.headBucket({ Bucket: `${config.ProjectFQDomain}.prime` }, err => {
    if (err) {
      console.log('false');
    } else {
      console.log('true');
    }
  });
};
