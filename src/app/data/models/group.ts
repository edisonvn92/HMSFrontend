export interface IGroup {
  group_id: number;
  group_default?: number;
  group_name: string;
  group_description?: string;
  doctor_number?: number;
  nurse_number?: number;
  patient_number?: number;
  hcps: Array<IDrNurse>;
  patients: Array<IPatient>;
  other_groups?: Array<any>;
  is_can_delete?: number;
}

export interface IGroupList {
  data: IGroup[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

export interface IDrNurse {
  hcp_code?: string;
  hcp_cognito_username?: string;
  hcp_full_name?: string;
  hcp_first_name?: string;
  hcp_middle_name?: string;
  hcp_last_name?: string;
  hcp_cognito_phone?: string;
  roles: Array<{
    role_id: number;
    role_name: string;
  }>;
}

export interface IPatient {
  patient_code?: string;
  patient_full_name?: string;
  patient_first_name?: string;
  patient_last_name?: string;
  patient_middle_name?: string;
  patient_birthday: string;
  patient_gender: string | number;
}
