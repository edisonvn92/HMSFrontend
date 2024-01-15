import { patientDairyEvent } from '@shared/helpers/data';

export const maxIcon = 6;

export const needShowEventList = [
  {
    icon: 'icon_smoking',
    value: patientDairyEvent.NO_SMOKING,
  },
  {
    icon: 'icon_smoking_1',
    value: patientDairyEvent.SMOKING,
  },
  {
    icon: 'icon_saving_sake',
    value: patientDairyEvent.NO_ALCOHOL,
  },
  {
    icon: 'icon_alcohol',
    value: patientDairyEvent.ALCOHOL,
  },
  {
    icon: 'icon_reduced_salt',
    value: patientDairyEvent.NO_SALT,
  },
  {
    icon: 'icon_salt',
    value: patientDairyEvent.SALT,
  },
  {
    icon: 'icon_vegetable_intake',
    value: patientDairyEvent.VEGETABLE,
  },
  {
    icon: 'icon_lack_of_vegetables',
    value: patientDairyEvent.NO_VEGETABLE,
  },
  {
    icon: 'icon_sleep',
    value: patientDairyEvent.SLEEP,
  },
  {
    icon: 'icon_lack_of_sleep',
    value: patientDairyEvent.NO_SLEEP,
  },
  {
    icon: 'icon_exercise',
    value: patientDairyEvent.MOTION,
  },
  {
    icon: 'icon_lack_of_exercise',
    value: patientDairyEvent.NO_MOTION,
  },
];
