/**
 * frontend's CloudFormation template supports both apps hosted at the root domain (e.g., https://frontend.com)
 * and apps hosted on a subdomain (what is configured below, https://frontend.bjacobel.com).
 * Note that setting the ProjectDomain and ProjectFQDomain to the same value will trigger config for the root domain
 * case, and will add extra resources (an additional A record and SAN for www.ProjectDomain).
 * You still need both values even if they are the same.
 */
const config = {
  // The common name for your project. Used for naming CloudFormation stacks and CloudFront distros.
  ProjectName: 'epsteinbrain',

  // The root domain that your project will live at. Used for creating hosted zones and connecting DNS.
  ProjectDomain: 'epstein.flights',

  // If project will live on a subdomain, give the fully qualified domain here. Otherwise use the same value as above.
  ProjectFQDomain: 'epstein.flights',

  // If you already have a Route53 hosted zone for the ProjectDomain domain, setting this value to `'true'` will
  // re-use the zone. Setting it to `'false'` will create a new zone.
  ExistingHostedZone: 'false',

  // Configuration for sentry.io error and release monitoring
  SentryOrg: 'bjacobelcom',
  SentryProject: 'epsteinbrain',
  RavenDSN: 'https://be801b109c2e46409e03a6b10e609bc2@sentry.io/1853268',

  // Configuration for Google Analytics
  GAProperty: 'UA-154504161-1',

  // AWS Region you would like services to be created in
  Region: 'us-east-2',
};

if (!module.parent && process.argv[2]) {
  const param = process.argv[2];
  console.log(config[param] || 'Not passed a valid config param.');
}

module.exports = config;
