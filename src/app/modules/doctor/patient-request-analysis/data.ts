import { heartSubjectiveSymptoms } from '@shared/helpers/data';

export const originalFields = {
  patient_analysis_status: {
    field: 'patient_analysis_status',
    isSort: false,
    sortType: '',
  },
  patient_analysis_end_at: {
    field: 'patient_analysis_end_at',
    isSort: false,
    sortType: '',
  },
  patient_analysis_payment_status: {
    field: 'patient_analysis_payment_created_at',
    isSort: false,
    sortType: '',
  },
  patient_analysis_start_at: {
    field: 'patient_analysis_start_at',
    isSort: false,
    sortType: '',
  },
  patient_full_name: {
    field: 'patient.patient_full_name',
    isSort: false,
    sortType: '',
  },
  patient_birthday: {
    field: 'patient.patient_birthday',
    isSort: false,
    sortType: '',
  },
  patient_email: {
    field: 'patient.patient_email',
    isSort: false,
    sortType: '',
  },
  vital_heart_beat_count: {
    field: 'patient.vital_heart_beat_count',
    isSort: true,
    sortType: '',
  },
  vital_heart_beat_count_af: {
    field: 'patient.vital_heart_beat_count_af',
    isSort: false,
    sortType: '',
  },
  vital_heart_beat_count_symptom: {
    field: 'patient.vital_heart_beat_count_symptom',
    isSort: false,
    sortType: '',
  },
};

export const tableColumns: any = [
  {
    key: 'patient_analysis_status',
    label: 'status',
    class_sort: 'ml-10',
    class_name: 'status',
    is_sort: true,
  },
  {
    key: 'patient_analysis_end_at',
    label: 'application date and time',
    class_sort: 'ml-10',
    class_name: 'application-date-and-time',
    is_sort: true,
  },
  {
    key: 'patient_analysis_payment_status',
    label: 'payment confirmation',
    class_sort: 'ml-10',
    class_name: 'payment-status',
    is_sort: true,
  },
  {
    key: 'patient_analysis_start_at',
    label: 'analysis period (2 weeks)',
    class_sort: 'ml-10',
    class_name: 'analysis-period',
    is_sort: true,
  },
  {
    key: 'patient_full_name',
    label: 'patient.name',
    class_sort: 'ml-10',
    class_name: 'name',
    is_sort: true,
  },
  {
    key: 'patient_birthday',
    label: 'patient.age',
    class_sort: 'ml-10',
    class_name: 'age',
    is_sort: true,
  },
  {
    key: 'patient_email',
    label: 'email address',
    class_sort: 'ml-10',
    class_name: 'email-address',
    is_sort: true,
  },
  {
    key: 'electrocardiogram',
    label: 'electrocardiogram',
    class_sort: '',
    class_name: 'electrocardiogram',
    is_sort: false,
  },
  {
    key: 'vital_heart_beat_count',
    label: 'number of electrocardiograms',
    class_sort: 'ml-10',
    class_name: 'electrocardiogram-times',
    is_sort: true,
  },
  {
    key: 'vital_heart_beat_count_af',
    label: 'number of af',
    class_sort: 'ml-10',
    class_name: 'af',
    is_sort: true,
  },
  {
    key: 'patient_analysis_note',
    label: 'message',
    class_sort: 'ml-10',
    class_name: 'message-content',
    is_sort: false,
  },
  {
    key: 'patient_email_utc_time',
    label: 'mail',
    class_sort: '',
    class_name: 'mail-confirm',
    is_sort: false,
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
    attribute: 'patient_analysis_status',
    type: 'asc',
  },
};

export const dataContentSubjectiveSymptoms = [
  {
    icon: 'shortness_of_breath',
    name_title: 'shortness of breath',
    value: heartSubjectiveSymptoms.SHORTNESS_OF_BREATH,
  },
  {
    icon: 'palpitation',
    name_title: 'palpitations',
    value: heartSubjectiveSymptoms.PALPITATIONS,
  },
  {
    icon: 'nausea',
    name_title: 'nausea',
    value: heartSubjectiveSymptoms.NAUSEA,
  },
  {
    icon: 'fatigue',
    name_title: 'fatigue',
    value: heartSubjectiveSymptoms.MALAISE,
  },
  {
    icon: 'dizzy',
    name_title: 'dizzy',
    value: heartSubjectiveSymptoms.DIZZY,
  },
  {
    icon: 'chest_pain',
    name_title: 'Chest pain',
    value: heartSubjectiveSymptoms.CHEST_PAIN,
  },
  {
    icon: 'others',
    name_title: 'others',
    value: heartSubjectiveSymptoms.OTHERS,
  },
  {
    icon: '',
    name_title: '',
    value: heartSubjectiveSymptoms.OTHERS,
    show_memo: true,
  },
  {
    icon: 'others',
    name_title: 'none',
    value: heartSubjectiveSymptoms.NONE,
  },
];
