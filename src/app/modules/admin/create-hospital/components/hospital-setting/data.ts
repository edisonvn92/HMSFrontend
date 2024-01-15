export const hospitalSetting = {
  alert: [
    { key: 'WEIGHT', id: 'alert-weight', text: 'weight alert' },
    { key: 'BP', id: 'alert-bp', text: 'bp alert' },
    { key: 'AF', id: 'alert-af', text: 'af alert' },
    { key: 'IHB', id: 'alert_ihb', text: 'irregular pulse wave alert' },
  ],
  help_types: [
    { id: 1, text: 'default help' },
    { id: 2, text: 'kmc help' },
    { id: 3, text: 'bp mobile app type (taiwan)' },
  ],
  bp_icon: [
    { id: 1, text: 'on' },
    { id: 0, text: 'off' },
  ],
  bp_calculation_type: [
    { id: 1, text: 'japanese style' },
    { id: 2, text: 'taiwanese style (more than 2 measurements within 10 minutes)' },
  ],
  system_settings: [
    { id: 1, text: 'ecg report', key: 'hospital_setting_shinden_report' },
    { id: 2, text: 'bp mobile app', key: 'hospital_setting_app_bp' },
  ],
  function_settings: [
    { key: 'hospital_setting_patient_register_web', id: 'setting-app', text: 'application / registration function' },
    { key: 'hospital_setting_confirm_log', id: 'setting-confirm-log', text: 'patient confirmation function' },
    {
      key: 'hospital_setting_treatment_date',
      id: 'setting-treatment-date',
      text: 'examination date registration function',
    },
    {
      key: 'hospital_setting_email_thanks',
      id: 'setting-email-thank',
      text: 'thank mail function',
    },
    { key: 'hospital_setting_alert_function', id: 'setting-alert-function', text: 'setting function' },
    {
      key: 'hospital_setting_register_notification',
      id: 'setting-register-notification',
      text: 'alert notification function',
    },
    { key: 'hospital_setting_monthly_report', id: 'setting-monthly-report', text: 'automatic report function' },
  ],
};
