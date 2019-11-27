const schema = require('./generate');
const AppSync = require('aws-sdk/clients/appsync');

(async () => {
  try {
    const apiId = process.argv[2];
    const region = process.argv[3];

    if (!apiId || !region) {
      throw new Error('Usage: upload [apiId] [region]');
    }

    const client = new AppSync({
      region
    });


    const preStatus = (await client.getSchemaCreationStatus({ apiId }).promise()).status;
    if (preStatus !== 'ACTIVE') {
      throw new Error(`Schema can't be updated because it's currently in state: ${preStatus}`);
    }

    await client.startSchemaCreation({
      apiId: '',
      definition: schema
    }).promise();

    let status = 'PROCESSING';
    let details;
    while (status === 'PROCESSING') {
      const checkStatus = await client.getSchemaCreationStatus().promise();
      status = checkStatus.status;
      details = checkStatus.details;
    }

    console.log(`Schema creation finished with status ${status}.\n${details}`);
  } catch(e) {
    console.error(e.message || e);
    process.exit(1)
  };
})();
