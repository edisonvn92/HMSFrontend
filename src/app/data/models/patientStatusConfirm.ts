export interface IPatientStatusConfirm {
  hcp: string;
  hcps: {
    hcp_full_name: string;
    hcp_id: string;
  };
  is_my_confirm: boolean;
  patient_status_confirm_utc_time: string;
}
