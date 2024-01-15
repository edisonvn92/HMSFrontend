export interface IPatientBasicInfo {
  patient_code: string;
  patient_first_name: string;
  patient_last_name: string;
  patient_middle_name: string;
  patient_birthday: string;
  patient_gender: number;
  patient_sys_goal: number;
  patient_dia_goal: number;
  patient_phone: string;
  patient_email: string;
  patient_age: number;
  patient_stat_7days_sys_morning: number;
  patient_stat_7days_sys_evening: number;
  patient_stat_7days_dia_morning: number;
  patient_stat_7days_dia_evening: number;
  patient_stat_7days_pulse_morning: number;
  patient_stat_7days_pulse_evening: number;
  vital_office_systolic: number;
  vital_office_diastolic: number;
  vital_office_pulse: number;
  vital_office_utc_time: string;
  user_stat_step_count: number;
  user_stat_step_km: number;
  user_stat_ldate: string;
  patient_stat_heart_beat_morning: number;
  patient_stat_heart_beat_ldate: string;
  patient_stat_sys_morning: number;
  patient_stat_dia_morning: number;
  patient_stat_bp_ldate: string;
  patient_review_ldate: string;
  patient_review_mets: number;
  medical_register_utc_time: string;
  vital_weight_value: number;
  vital_weight_ldate: string;
  weight_ratio: number;
  vital_temperature_body: number;
  vital_temperature_ldate: string;
  vital_temperature_body_7days: number;
  vital_office_standardized: boolean;
}

export interface IHospitalPatient {
  patient_id: string;
  patient_code: string;
  patient_full_name?: string;
  patient_birthday?: string;
  patient_gender?: Number;
  patient_risk_score?: Number;
  patient_start_period_of_use?: string;
  patient_end_period_of_use?: string;
  group_name?: string;
  patient_first_name?: string;
  patient_last_name?: string;
  patient_middle_name?: string;
  patient_use_ogsc_username?: string;
  groups: any;
}

export interface IHospitalPatientList {
  data: IHospitalPatient[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}
