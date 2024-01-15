/* tslint:disable */
// @ts-nocheck
const { writeFile, existsSync, mkdirSync } = require('fs');
const dotenv = require('dotenv');

const result = dotenv.config();

if (result.error) {
  throw result.error;
}

function writeFileUsingFS(targetPath, environmentFileContent) {
  writeFile(targetPath, environmentFileContent, function (err) {
    if (err) {
      console.log(err);
    }
    if (environmentFileContent !== '') {
      console.log(`wrote variables to ${targetPath}`);
    }
  });
}

// Providing path to the `environments` directory
const envDirectory = './src/environments';

// creates the `environments` directory if it does not exist
if (!existsSync(envDirectory)) {
  mkdirSync(envDirectory);
}

//creates the `environment.ts` file if it does not exist
writeFileUsingFS('./src/environments/environment.ts', '');

// choose the correct targetPath based on the environment chosen
const targetPath = './src/environments/environment.ts';

//actual content to be compiled dynamically and pasted into respective environment files
const environmentFileContent = `
  export const environment = {
    env: '${process.env.ENV}',
    api_url: '${process.env.API_URL}',
    aws_cognito_region: '${process.env.AWS_COGNITO_REGION}',
    aws_user_pools_id: '${process.env.AWS_USER_POOLS_ID}',
    aws_user_pools_web_client_id: '${process.env.AWS_USER_POOLS_WEB_CLIENT_ID}',
    aws_user_pools_id_admin: '${process.env.AWS_USER_POOLS_ID_ADMIN}',
    aws_user_pools_web_client_id_admin: '${process.env.AWS_USER_POOLS_WEB_CLIENT_ID_ADMIN}',
    frontend_url: '${process.env.FRONTEND_URL}',
    omron_connect_registration_link: '${process.env.OMRON_CONNECT_REGISTRATION_LINK}',
    omron_connect_purchase_link: '${process.env.OMRON_CONNECT_PURCHASE_LINK}',
    omron_connect_group_id: '${process.env.OMRON_CONNECT_GROUP_ID}',
    omron_connect_app_id: '${process.env.OMRON_CONNECT_APP_ID}',
    amchart_license_code: '${process.env.AMCHART_LICENSE_CODE}',
    firebase_key_pair: '${process.env.FIREBASE_KEY_PAIR}',
    firebase_server_key: '${process.env.FIREBASE_SERVER_KEY}',
    firebase_api_key: '${process.env.FIREBASE_API_KEY}',
    firebase_auth_domain: '${process.env.FIREBASE_AUTH_DOMAIN}',
    firebase_project_id: '${process.env.FIREBASE_PROJECT_ID}',
    firebase_storage_bucket: '${process.env.FIREBASE_STORAGE_BUCKET}',
    firebase_messaging_sender_id: '${process.env.FIREBASE_MESSAGING_SENDER_ID}',
    firebase_app_id: '${process.env.FIREBASE_APP_ID}',
    service_env: '${process.env.SERVICE_ENV}'
  };
`;

writeFileUsingFS(targetPath, environmentFileContent); // appending data into the target file

/* tslint:enable */
