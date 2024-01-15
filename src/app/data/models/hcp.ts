import { IGroup } from './group';

export interface IHcp {
  hcp_id: string;
  hcp_code: string;
  hcp_cognito_username?: string;
  hcp_full_name?: string;
  hcp_cognito_phone?: string;
  hcp_last_login?: string;
  hcp_start_period_of_use?: string;
  hcp_end_period_of_use?: string;
  role_name: string;
  hcp_none_delete: number;
  groups: IGroup[];
}

export interface IHcpList {
  data: IHcp[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}
