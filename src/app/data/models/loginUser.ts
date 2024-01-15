export interface ILoginUser {
  hcp_last_name: string;
  hcp_middle_name: string;
  hcp_first_name: string;
  hcp_id: string;
  groups: Array<{ group_id: number; group_name: string }>;
  roles: Array<string>;
  hospital: {
    hospital_name: string;
    hospital_address: string;
  };
}
