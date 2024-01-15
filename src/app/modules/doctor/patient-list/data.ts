import { componentCode } from '@shared/helpers/data';

export const originalFields = {
  L01: {
    field: 'patient_code',
    isSort: false,
    sortType: '',
    componentCode: componentCode.PATIENT_CODE,
  },
  L02: {
    field: 'patient_full_name',
    isSort: false,
    sortType: '',
    componentCode: componentCode.FULL_NAME,
  },
  L03: {
    field: 'patient_gender',
    isSort: false,
    sortType: '',
    componentCode: componentCode.GENDER,
  },
  L04: {
    field: 'patient_stat_7day.patient_stat_7days_sys',
    isSort: false,
    sortType: '',
    componentCode: componentCode.BLOOD_PRESSURE_7_DAYS,
  },
  L05: {
    field: 'patient_stat_7day.patient_stat_7days_sys_morning',
    isSort: false,
    sortType: '',
    componentCode: componentCode.MORNING_BLOOD_PRESSURE_7_DAYS,
  },
  L06: {
    field: 'patient_stat_7day.patient_stat_7days_sys_evening',
    isSort: false,
    sortType: '',
    componentCode: componentCode.EVENING_PRESSURE_7_DAYS,
  },
  L07: {
    field: 'patient_stat_7day.patient_stat_7days_pulse',
    isSort: false,
    sortType: '',
    componentCode: componentCode.PULSE_7_DAYS,
  },
  L08: {
    field: 'user_stat_7days.user_stat_7days_ihb',
    isSort: false,
    sortType: '',
    componentCode: componentCode.IRREGULAR_PULSE_WAVE_7_DAYS,
  },
  L09: {
    field: 'user_stat_7days.user_stat_7days_count_measurement',
    isSort: false,
    sortType: '',
    componentCode: componentCode.NUMBER_OF_MEASUREMENT,
  },
  L10: {
    field: 'user_stat_7days.user_stat_7days_weight',
    isSort: false,
    sortType: '',
    componentCode: componentCode.WEIGHT_AVERAGE_7_DAYS,
  },
  L11: {
    field: 'user_stat_7days.user_stat_7days_weight_ratio',
    isSort: false,
    sortType: '',
    componentCode: componentCode.WEIGHT_RATIO,
  },
  L12: {
    field: 'user_stat_7days.user_stat_7days_memo',
    isSort: false,
    sortType: '',
    componentCode: componentCode.MEMO,
  },
  L13: {
    field: 'patient_sys_goal',
    isSort: false,
    sortType: '',
    componentCode: componentCode.BLOOD_PRESSURE_TARGET,
  },
  L14: {
    field: 'patient_stat_7day.risk_score',
    isSort: false,
    sortType: '',
    componentCode: componentCode.BLOOD_PRESSURE_RISK,
  },
  L15: {
    field: 'vital_office.vital_office_utc_time',
    isSort: false,
    sortType: '',
    componentCode: componentCode.LAST_MEDICAL_TREATMENT_DAY,
  },
  L16: {
    field: 'vital_bps.vital_bp_ldatetime',
    isSort: false,
    sortType: '',
    componentCode: componentCode.LAST_BLOOD_PRESSURE_MEASUREMENT,
  },
  L17: {
    field: 'patient_status_confirms.my_confirm_utc_time',
    isSort: false,
    sortType: '',
    componentCode: componentCode.CONFIRM_STATUS_SELF,
  },
  L18: {
    field: 'patient_status_confirms.other_confirm_utc_time',
    isSort: false,
    sortType: '',
    componentCode: componentCode.CONFIRM_STATUS_OTHER,
  },
  L19: {
    field: 'patient_birthday',
    isSort: false,
    sortType: '',
    componentCode: componentCode.AGE,
  },
  L21: {
    field: 'patient_stat_7day.patient_stat_7days_pulse_morning',
    isSort: false,
    sortType: '',
    componentCode: componentCode.MORNING_PULSE,
  },
  L20: {
    field: 'patient_stat_7day.patient_stat_7days_pulse_evening',
    isSort: false,
    sortType: '',
    componentCode: componentCode.EVENING_PULSE,
  },
  L22: {
    field: 'patient_stat_7day.patient_stat_7days_heart_beat_morning',
    isSort: false,
    sortType: '',
    componentCode: componentCode.MORNING_HEAT_RATE,
  },
  L23: {
    field: 'patient_stat_7day.patient_stat_7days_heart_beat_evening',
    isSort: false,
    sortType: '',
    componentCode: componentCode.EVENING_HEAT_RATE,
  },
  L24: {
    field: 'patient_stat_7day.patient_stat_7days_heart_beat',
    isSort: false,
    sortType: '',
    componentCode: componentCode.HEAT_RATE_AVERAGE,
  },
  L27: {
    field: 'user_stats.user_stat_af',
    isSort: false,
    sortType: '',
    componentCode: componentCode.AF,
  },
  L25: {
    field: 'user_stat_7days.user_stat_7days_mets',
    isSort: false,
    sortType: '',
    componentCode: componentCode.NYHA,
  },
  L26: {
    field: 'user_stats.user_stat_ldate',
    isSort: false,
    sortType: '',
    componentCode: componentCode.LAST_UPDATED,
  },
  L28: {
    field: 'is_alert',
    isSort: false,
    sortType: '',
    componentCode: componentCode.HAS_ALERT,
  },
  L29: {
    field: 'patient_stat_7day.patient_stat_7days_over_bp',
    isSort: false,
    sortType: '',
    componentCode: componentCode.EXCEEDING_THRESHOLD,
  },
  L30: {
    field: 'patient_stat_7day.patient_stat_7days_take_medicine',
    isSort: false,
    sortType: '',
    componentCode: componentCode.MEDICATION_RATE,
  },
  L31: {
    field: 'patient_stat_7day.patient_stat_7days_symptom',
    isSort: false,
    sortType: '',
    componentCode: componentCode.SIDE_EFFECTS,
  },
  L32: {
    field: 'patient_stat_7day.patient_stat_7days_complete_level',
    isSort: false,
    sortType: '',
    componentCode: componentCode.COMPLETION_LEVEL,
  },
  L33: {
    field: 'user_stat_7days.user_stat_7days_ihb_percent',
    isSort: false,
    sortType: '',
    componentCode: componentCode.IHB_RATE,
  },
  L34: {
    field: 'vital_office.vital_office_utc_time',
    isSort: false,
    sortType: '',
    componentCode: componentCode.FINAL_MEDICAL_TREATMENT,
  },
};

export const tooltipNYHAList = [
  {
    activity: 'tooltip.not at all',
    exercise_intensity: '6.0',
    classification: 'I',
    suffix: 'above',
  },
  {
    activity: 'tooltip.jogging lightly',
    exercise_intensity: '6.0',
    classification: 'I',
  },
  {
    activity: 'tooltip.take a bath alone',
    exercise_intensity: '5.0',
    classification: 'II S',
  },
  {
    activity: 'tooltip.walk fast',
    exercise_intensity: '4.3',
    classification: 'II S',
  },
  {
    activity: 'tooltip.slowly climb the stairs',
    exercise_intensity: '4.0',
    classification: 'II M',
  },
  {
    activity: 'tooltip.take a walk',
    exercise_intensity: '3.5',
    classification: 'II M',
  },
  {
    activity: 'tooltip.change clothes',
    exercise_intensity: '2.5',
    classification: 'III',
  },
  {
    activity: 'tooltip.move in the house',
    exercise_intensity: '2.0',
    classification: 'III',
  },
  {
    activity: 'tooltip.toilet alone',
    exercise_intensity: '1.8',
    classification: 'IV',
  },
];

export const bodyRequest: any = {
  limit: 20,
  page: 1,
  filter: {
    like: {
      id_or_name: '',
    },
  },
  sort: {
    attribute: '',
    type: '',
  },
  groups: [],
};
