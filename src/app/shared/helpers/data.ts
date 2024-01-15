import Validators from '@shared/validators/base.validator';

export enum errorStatus {
  UNAUTHORIZED_CODE = 401,
  FORBIDDEN_CODE = 403,
  NOT_FOUND_CODE = 404,
  BAD_REQUEST_CODE = 400,
  INTERNAL_ERROR_CODE = 500,
  REQUEST_TOO_LONG = 413,
}

export const MAX_IHB = 2147483647;

export const role = {
  system_admin: 'System Admin',
  hospital: 'Hospital Administrator',
  doctor: 'Doctor',
  nurse: 'Nurse',
};

export const expiringTimeInSecond = 1800;

export const adminMenuList = [
  // TODO
  {
    name: 'hospital management',
    path: '/admin/hospital',
    icon: 'icon_home.svg',
    iconStyle: {
      width: 18,
      height: 19,
    },
  },
  {
    name: 'user management',
    path: '/admin/user',
    icon: 'icon_group.svg',
    iconStyle: {
      width: 20,
      height: 12,
    },
  },
  {
    name: 'import csv',
    path: '/admin/import-csv',
    icon: 'icon_doctor.svg',
    iconStyle: {
      width: 18,
      height: 19,
    },
  },
  {
    name: 'medicine management',
    path: '/admin/medicine',
    icon: 'ic_medicine.svg',
    iconStyle: {
      width: 18,
      height: 19,
    },
  },
];

export const hospitalMenuList = [
  {
    name: 'home',
    path: '/hospital/home',
    icon: 'icon_home.svg',
    iconStyle: {
      width: 18,
      height: 18,
    },
  },
  {
    name: 'group management',
    path: '/hospital/group-list',
    icon: 'icon_group.svg',
    iconStyle: {
      width: 20,
      height: 12,
    },
  },
  {
    name: 'user management',
    path: '/hospital/user-list',
    icon: 'icon_doctor.svg',
    iconStyle: {
      width: 18,
      height: 19,
    },
  },
  {
    name: 'patient management',
    path: '/hospital/patient-list',
    icon: 'icon_patient.svg',
    iconStyle: {
      width: 20,
      height: 14,
    },
  },
];

export const doctorMenuList = [
  {
    name: 'patient list',
    path: '/doctor/patient',
    icon: 'icon_user_menu.svg',
    class: 'icon-user-menu',
    iconStyle: {
      width: 18,
      height: 20,
    },
  },
  {
    name: 'alert list',
    path: '/doctor/alert-list',
    icon: 'icon_alert2.svg',
    class: 'icon-alert',
    isAlert: true,
    iconStyle: {
      width: 23,
      height: 23,
    },
  },
  {
    name: 'ecg analysis request',
    path: '/doctor/patient-request-analysis',
    icon: 'ic_ecg_analysis.svg',
    isAnalysisRequest: true,
    iconStyle: {
      width: 23,
      height: 23,
    },
  },
];

export const hospitalSettingList = [
  {
    name: 'setting blood threshold',
    path: '/hospital/setting-blood-threshold',
  },
  {
    name: 'setting alert',
    path: '/hospital/setting-alert',
  },
  {
    name: 'setting time',
    path: '/hospital/setting-time',
  },
];

export enum pagination {
  PER_PAGE = 20,
  PAGE = 1,
}

export enum sex {
  MALE = 1,
  FEMALE = 0,
}

export const gender = [
  {
    text: 'male',
    value: 1,
  },
  {
    text: 'female',
    value: 0,
  },
];

export const fullDayOfWeek = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
export const fullDayOfWeekDatePicker = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
export const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export const roles = [
  {
    role_id: 1,
    role_name: 'Hospital Administrator',
  },
  {
    role_id: 2,
    role_name: 'Doctor',
  },
  {
    role_id: 3,
    role_name: 'Nurse',
  },
];

export enum patientDairySymptom {
  SWELLING = 1,
  SHORTNESS_BREATH = 2,
  PALPITATIONS = 3,
  DROP = 4,
  INSOMNIA = 5,
}

export enum patientDairyMedication {
  MORNING = 1,
  NOON = 2,
  EVENING = 3,
  BEDTIME = 4,
  EMERGENCY = 5,
}

export enum patientDairyEvent {
  MEDICATION_TIME_1 = 1,
  MEDICATION_TIME_2 = 2,
  MEDICATION_TIME_3 = 3,
  NO_SMOKING = 4,
  SMOKING = 5,
  NO_ALCOHOL = 6,
  ALCOHOL = 7,
  NO_SALT = 8,
  SALT = 9,
  VEGETABLE = 10,
  NO_VEGETABLE = 11,
  SLEEP = 12,
  NO_SLEEP = 13,
  MOTION = 14,
  NO_MOTION = 15,
  HOSPITAL = 16,
}

export enum periodOptions {
  PERIOD_2W = 14,
  PERIOD_4W = 28,
  PERIOD_12W = 84,
}

export enum componentType {
  LIST = 1,
  LEFT_PANEL = 2,
  RIGHT_PANEL = 3,
}

export enum componentCode {
  PATIENT_CODE = 'L01',
  FULL_NAME = 'L02',
  GENDER = 'L03',
  BLOOD_PRESSURE_7_DAYS = 'L04',
  MORNING_BLOOD_PRESSURE_7_DAYS = 'L05',
  EVENING_PRESSURE_7_DAYS = 'L06',
  PULSE_7_DAYS = 'L07',
  IRREGULAR_PULSE_WAVE_7_DAYS = 'L08',
  NUMBER_OF_MEASUREMENT = 'L09',
  WEIGHT_AVERAGE_7_DAYS = 'L10',
  WEIGHT_RATIO = 'L11',
  MEMO = 'L12',
  BLOOD_PRESSURE_TARGET = 'L13',
  BLOOD_PRESSURE_RISK = 'L14',
  LAST_MEDICAL_TREATMENT_DAY = 'L15',
  LAST_BLOOD_PRESSURE_MEASUREMENT = 'L16',
  CONFIRM_STATUS_SELF = 'L17',
  CONFIRM_STATUS_OTHER = 'L18',
  AGE = 'L19',
  EVENING_PULSE = 'L20',
  MORNING_PULSE = 'L21',
  MORNING_HEAT_RATE = 'L22',
  EVENING_HEAT_RATE = 'L23',
  HEAT_RATE_AVERAGE = 'L24',
  NYHA = 'L25',
  LAST_UPDATED = 'L26',
  AF = 'L27',
  HAS_ALERT = 'L28',
  EXCEEDING_THRESHOLD = 'L29',
  MEDICATION_RATE = 'L30',
  SIDE_EFFECTS = 'L31',
  COMPLETION_LEVEL = 'L32',
  IHB_RATE = 'L33',
  FINAL_MEDICAL_TREATMENT = 'L34',
  HOME_MORNING_BLOOD_PRESSURE_7_DAYS = 'LP01',
  HOME_EVENING_BLOOD_PRESSURE_7_DAYS = 'LP02',
  BLOOD_PRESSURE_GOAL = 'LP03',
  LATEST_OFFICE_BLOOD_PRESSURE = 'LP04',
  STEP_COUNT_YESTERDAY = 'LP05',
  BODY_TEMPERATURE = 'LP06',
  BODY_WEIGHT_RATIO = 'LP07',
  LATEST_MORNING_BLOOD_PRESSURE = 'LP08',
  CALENDAR = 'LP09',
  LATEST_EXAMINATION_DATE = 'LP10',
  MIN_METS = 'LP11',
  LATEST_MORNING_HEART_RATE = 'LP12',
  LATEST_ALERT = 'LP13',
  MAILER = 'LP14',
  REPORT = 'LP15',
  HEART_BEAT_REPORT = 'LP16',
  STANDARDIZED = 'LP17',
  BLOOD_PRESSURE_PULSE_GRAPH = 'RP01',
  WEIGHT_GRAPH = 'RP02',
  STEP_COUNT_GRAPH = 'RP03',
  BODY_TEMPERATURE_GRAPH = 'RP04',
  BLOOD_PRESSURE_MEDICATION_GRAPH = 'RP05',
  DIARY_GRAPH = 'RP06',
  ALERT_GRAPH = 'RP07',
  SYMPTOM_GRAPH = 'RP08',
  REVIEW_GRAPH = 'RP09',
  HEART_FAILURE_MEDICATION_GRAPH = 'RP10',
  PROGNOSIS_SUBJECTIVE_SYMPTOM_GRAPH = 'RP11',
  HEARTBEAT_GRAPH = 'RP12',
  NYHA_GRAPH = 'RP13',
  OTHER_GRAPH = 'RP14',
  PATIENT_MESSAGE = 'RP15',
  HOSPITAL_VISIT = 'RP16',
  SYNC_PATIENT = 'RP17',
}

export enum alertNewStatus {
  UNSEEN = 1,
  SEEN = 2,
}
export enum alertNewType {
  WEIGHT = 1,
  BP = 2,
  IHB = 3,
  AF = 4,
}

export enum alertType {
  TYPE1 = 1,
  TYPE2 = 2,
}

export const bloodPressureLevel = {
  low: 'L',
  medium: 'M',
  mediumHigh: 'MH',
  high: 'H',
};

export const smartphone = [
  {
    id: 0,
    name: '',
  },
  {
    id: 1,
    name: 'iphone',
  },
  {
    id: 2,
    name: 'android',
  },
  {
    id: 3,
    name: 'other',
  },
];

export enum status {
  OFF = 0,
  ON = 1,
}

export enum mailStatus {
  FAILURE = 1,
  SUCCESS = 2,
}

export enum reportStatus {
  UNCONFIRMED_EMAIL = 0,
  FAILURE = 1,
  SUCCESS = 2,
}

export enum reportType {
  MANUAL = 1,
  AUTOMATIC = 2,
}

export enum patientReviewItem {
  NOT_ACTION = 0,
  TOILET = 1,
  INDOOR_WALKING = 2,
  CHANGE_CLOTHES = 3,
  TAKE_A_WALK = 4,
  STAIRS = 5,
  WALK_FAST = 6,
  BATHING = 7,
  JOG = 8,
}

export enum deviceTypeSendNotification {
  WEB = 1,
  MOBILE = 2,
}

export const reviewMets: any = [
  {
    position: 0,
    level: 'I',
    value: '0',
    activity_name: 'tooltip.not at all',
  },
  {
    position: 1,
    level: 'IV',
    value: '1.8',
    activity_name: 'tooltip.toilet alone',
  },
  {
    position: 2,
    level: 'III',
    value: '2.0',
    activity_name: 'tooltip.move in the house',
  },
  {
    position: 3,
    level: 'III',
    value: '2.5',
    activity_name: 'tooltip.change clothes',
  },
  {
    position: 4,
    level: 'II M',
    value: '3.5',
    activity_name: 'tooltip.take a walk',
  },
  {
    position: 5,
    level: 'II M',
    value: '4.0',
    activity_name: 'tooltip.slowly climb the stairs',
  },
  {
    position: 6,
    level: 'II S',
    value: '4.3',
    activity_name: 'tooltip.walk fast',
  },
  {
    position: 7,
    level: 'II S',
    value: '5.0',
    activity_name: 'tooltip.take a bath alone',
  },
  {
    position: 8,
    level: 'I',
    value: '6.0',
    activity_name: 'tooltip.jogging lightly',
  },
];

export const settingAlertValidator = {
  alert_weight1_days: [Validators.required, Validators.min(1), Validators.max(365)],
  alert_weight1_ratio: [
    Validators.required,
    Validators.pattern('^\\d*(\\.\\d{0,1})?$'),
    Validators.min(0.1),
    Validators.max(50),
  ],
  alert_weight2_days: [Validators.required, Validators.min(1), Validators.max(365)],
  alert_weight2_ratio: [
    Validators.required,
    Validators.pattern('^\\d*(\\.\\d{0,1})?$'),
    Validators.min(0.1),
    Validators.max(50),
  ],
  alert_high_bp_sys: [Validators.required, Validators.min(40), Validators.max(280)],
  alert_high_bp_dia: [Validators.required, Validators.min(40), Validators.max(280)],
  alert_low_bp_sys: [Validators.required, Validators.min(40), Validators.max(280)],
  alert_low_bp_dia: [Validators.required, Validators.min(40), Validators.max(280)],
  alert_af1_days: [Validators.required, Validators.min(1), Validators.max(365)],
  alert_af1_times: [Validators.required, Validators.min(1), Validators.max(99)],
  alert_af2_times: [Validators.required, Validators.min(2), Validators.max(99)],
  alert_ihb1_days: [Validators.required, Validators.min(1), Validators.max(MAX_IHB)],
  alert_ihb1_times: [Validators.required, Validators.min(1), Validators.max(MAX_IHB)],
  alert_ihb2_times: [Validators.required, Validators.min(1), Validators.max(MAX_IHB)],
};

export const defaultMinMaxBP = {
  min: 25,
  max: 285,
};

export const BloodPressureThreshold = {
  diff_sys_1: 15,
  diff_sys_2: 25,
  diff_dia_1: 10,
  diff_dia_2: 20,
};

export enum language {
  ENGLISH = 'en',
  JAPANESE = 'ja',
}

export const defaultPatientLanguage = 'en';

export const bloodPressureReportName: any = {
  ja: '血圧レポート',
  en: 'BP_Report',
};
export const bloodECGReportName: any = {
  ja: '心電レポート',
  en: 'ECGReport',
};
export const report: any = {
  ja: {
    day_of_week: {
      monday: '月',
      tuesday: '火',
      wednesday: '水',
      thursday: '木',
      friday: '金',
      saturday: '土',
      sunday: '日',
    },
    goal: '目標',
    record_count: '記録回数',
    last_month: '前月',
    month: '月',
    symptom: {
      chest_pain: '胸痛',
      dizzy: 'めまい',
      malaise: '倦怠感',
      nausea: '吐き気',
      palpitations: '動悸',
      shortness_of_breath: '息切れ',
      others: 'その他',
      none: '症状なし',
    },
  },
  en: {
    day_of_week: {
      monday: 'Mon',
      tuesday: 'Tue',
      wednesday: 'Wed',
      thursday: 'Thu',
      friday: 'Fri',
      saturday: 'Sat',
      sunday: 'Sun',
    },
    goal: 'Goal',
    record_count: 'Record count',
    last_month: 'Last month',
    month: 'M',
    symptom: {
      chest_pain: 'Chest pain',
      dizzy: 'Dizzy',
      malaise: 'Malaise',
      nausea: 'Nausea',
      palpitations: 'Palpitation',
      shortness_of_breath: 'Shortness of breath',
      others: 'Others',
      none: 'None',
    },
  },
};

export enum medicationStatus {
  NOT_SETTING = 1,
  NOT_USE = 2,
  USE = 3,
}
export const ECGDataResult: any = {
  NORMAL: 200,
  TACHYCARDIA: 201,
  BRADYCARDIA: 207,
  AFIB_POSSIBLE: 214,
  NO_ANALYTICS: 218,
  UNCLASSIFIED: 296,
  TOO_SHORT: 297,
  TOO_LONG: 298,
  UNREADABLE: 299,
};

export const heartSubjectiveSymptoms: any = {
  NONE: 1,
  OTHERS: 2,
  CHEST_PAIN: 3,
  DIZZY: 4,
  MALAISE: 5,
  NAUSEA: 6,
  PALPITATIONS: 7,
  SHORTNESS_OF_BREATH: 8,
};

export const exerciseIntensity: any = {
  NOT_ENTERED: 0,
  STRONG: 1,
  MEDIUM: 2,
  WEAK: 3,
  REST: 4,
};

export const errorCode: any = {
  UNAUTHORIZED_CODE: 401,
  FORBIDDEN_CODE: 403,
};

export const planHasMedicineType: any = {
  MORNING: 1,
  NOON: 2,
  EVENING: 3,
  BEDTIME: 4,
};

export const hospitalEmailTemplateType: any = {
  EMAIL_REPORT_MANUAL_BP: 1,
  REPORT: 2,
  VITAL_DATA: 3,
  SHINDEN_MAIL_REPLY: 4,
};

export enum loginType {
  DASHBOARD = 1,
  ADMIN = 0,
}

export enum paymentStatus {
  COMPLETE = 2,
  PAID_INCOMPLETE = 1,
  UNPAID = 0,
}

export enum importStatus {
  INPROGRESS = 0,
  SUCCESS = 1,
  ERROR = 2,
  NONE_UPLOAD = 4,
}
