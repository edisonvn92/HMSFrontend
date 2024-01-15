export interface IHospitalInfo {
  hospital_name: string;
  hospital_code: string;
  hospital_address: string;
  hospital_setting: any;
}

export interface IHospitalSetting {
  hospital_setting_dia_ranking_high: string;
  hospital_setting_dia_ranking_medium_high: string;
  hospital_setting_dia_ranking_medium: string;
  hospital_setting_dia_ranking_low: string;
  hospital_setting_sys_ranking_high: string;
  hospital_setting_sys_ranking_medium_high: string;
  hospital_setting_sys_ranking_medium: string;
  hospital_setting_sys_ranking_low: string;
}

export interface IHospitalDashboardSetting {
  hospital_dashboard_id: number;
  hospital_dashboard_order: number;
  components: Array<{
    component_code: string;
    component_description?: string;
    component_id: number;
    component_type: number;
  }>;
}

export interface IHospitalWeightAlertSetting {
  hospital_threshold_alert_weight1_days: number;
  hospital_threshold_alert_weight1_ratio: number;
  hospital_threshold_alert_weight1_status: number;
  hospital_threshold_alert_weight2_days: number;
  hospital_threshold_alert_weight2_ratio: number;
  hospital_threshold_alert_weight2_status: number;
  updated_at: string;
}
