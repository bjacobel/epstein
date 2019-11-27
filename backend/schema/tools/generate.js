const path = require('path');
const { importSchema } = require('graphql-import');

// side effects bad but whatever
module.exports = importSchema(path.join(__dirname, '../index.graphql'));
