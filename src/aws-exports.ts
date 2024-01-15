import { environment } from './environments/environment';

const awsConfigDashboard: any = {
  aws_cognito_region: environment.aws_cognito_region, // (required) - Region where Amazon Cognito project was created
  aws_user_pools_id: environment.aws_user_pools_id, // (optional) -  Amazon Cognito User Pool ID
  aws_user_pools_web_client_id: environment.aws_user_pools_web_client_id, // (optional) - Amazon Cognito App Client ID (App client secret needs to be disabled)
};

const awsConfigAdmin: any = {
  aws_cognito_region: environment.aws_cognito_region, // (required) - Region where Amazon Cognito project was created
  aws_user_pools_id: environment.aws_user_pools_id_admin, // (optional) -  Amazon Cognito User Pool ID
  aws_user_pools_web_client_id: environment.aws_user_pools_web_client_id_admin, // (optional) - Amazon Cognito App Client ID (App client secret needs to be disabled)
};

export default { awsConfigDashboard, awsConfigAdmin };
