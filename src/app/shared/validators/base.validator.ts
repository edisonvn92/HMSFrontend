import { AbstractControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';

const isEmptyInputValue = (value: any) =>
  // we don't check for string here so it also works with arrays
  value == null || value.length === 0 || value.toString().trim() === '';

export default class BaseValidators extends Validators {
  /**
   * Validator that requires the control have a non-empty value.
   *
   * @param control - The control whose value pass a validation test.
   * @returns An error map with the `required` property.
   */
  public static required(control: AbstractControl): ValidationErrors | null {
    return isEmptyInputValue(control.value) ? { required: true } : null;
  }

  /**
   * Validate that the password field matches the passwordConfirm field.
   *
   * @param password - The password field is used for confirmation.
   * @param passwordConfirm - The passwordConfirm field is used for confirmation.
   * @returns An error map with the `password_mismatch` property.
   */
  public static passwordMatch(password: string, passwordConfirm: string) {
    return (group: FormGroup): ValidationErrors | null => {
      if (!group.controls[password].value || !group.controls[passwordConfirm].value) {
        return null; // don't validate empty values to allow optional controls
      }

      return group.controls[password].value !== group.controls[passwordConfirm].value
        ? { password_mismatch: true }
        : null;
    };
  }

  /**
   * Validate that the field matches a valid alpha numeric pattern.
   *
   * @param control - The control whose value pass an alphaNumeric validation test.
   * @returns An error map with the `alpha numeric` property.
   */
  public static alphaNumeric(control: AbstractControl): ValidationErrors | null {
    const ALPHA_NUMERIC_REGEXP = new RegExp('^[a-zA-Z0-9]+$');

    if (isEmptyInputValue(control.value)) {
      return null; // don't validate empty values to allow optional controls
    }

    return ALPHA_NUMERIC_REGEXP.test(control.value) ? null : { alpha_numeric: true };
  }

  /**
   * Validate that the field matches a valid password rules pattern.
   *
   * @param control - The control whose value pass a passwordRules validation test.
   * @returns An error map with the `password` property.
   */
  public static passwordRules(control: AbstractControl): ValidationErrors | null {
    // eslint-disable-next-line prettier/prettier
    const PASSWORD_REGEXP = new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])');

    if (isEmptyInputValue(control.value)) {
      return null; // don't validate empty values to allow optional controls
    }

    return PASSWORD_REGEXP.test(control.value) ? null : { password_rules: true };
  }

  /**
   * Validate that the field doesn't contain invalid characters
   *
   * @param control - The control whose value pass a checkPasswordValidCharacter validation test.
   * @returns An error map with the `password` property.
   */
  public static checkPasswordValidCharacter(control: AbstractControl): ValidationErrors | null {
    // eslint-disable-next-line prettier/prettier
    const PASSWORD_VALID_REGEXP = /^([a-zA-Z0-9\^$*.\[\]{}\(\)?\-\"!@#%&\/,><\':;|_~`]+)$/;

    if (isEmptyInputValue(control.value)) {
      return null; // don't validate empty values to allow optional controls
    }

    return PASSWORD_VALID_REGEXP.test(control.value) && PASSWORD_VALID_REGEXP.test(control.value)
      ? null
      : { password_valid_character: true };
  }

  /**
   * Validate that the field matches a valid numeric pattern.
   *
   * @param control - The control whose value pass an numeric validation test.
   * @returns An error map with the `numeric` property.
   */
  public static numeric(control: AbstractControl): ValidationErrors | null {
    if (isEmptyInputValue(control.value)) {
      return null; // don't validate empty values to allow optional controls
    }

    return !isNaN(parseFloat(control.value)) && isFinite(control.value) ? null : { numeric: true };
  }

  /**
   * Validate that a field has lower value than another field
   * @param lowerField field name of lower value field
   * @param higherField field name of highter value field
   */
  public static hasSmallerValue(lowerField: string, higherField: string) {
    return (group: FormGroup): ValidationErrors | null => {
      if (!group.controls[lowerField].value || !group.controls[higherField].value) {
        return null; // don't validate empty values to allow optional controls
      }

      return Number(group.controls[lowerField].value) > Number(group.controls[higherField].value)
        ? { has_lower_value: true }
        : null;
    };
  }

  /**
   * Validate that a field has lower value than mobile field
   * @param mobile field name of mobile value field
   */
  public static checkFormattedMobile(control: AbstractControl): ValidationErrors | null {
    if (isEmptyInputValue(control.value)) {
      return null; // don't validate empty values to allow optional controls
    }
    var numberRegex = /^[+]?\d+$/;
    return !numberRegex.test(control.value) ? { pattern: true } : null;
  }

  /**
   * Validate that the field matches a valid file name rules  pattern.
   *
   * @param control - The control whose value pass a file name validation test.
   * @returns An error map with the `file_name` property.
   */
  public static fileName(control: AbstractControl): ValidationErrors | null {
    // eslint-disable-next-line prettier/prettier
    const FILE_NAME_RESERVED_REGEXP = new RegExp('[<>:"/\\|?*\u0000-\u001F]');
    const WINDOW_RESERVED_NAME_REGEXP = new RegExp('^(con|prn|aux|nul|comd|lptd)$');

    if (isEmptyInputValue(control.value)) {
      return null; // don't validate empty values to allow optional controls
    }

    if (!control.value || control.value.length > 255) {
      return { file_name: true };
    }

    if (FILE_NAME_RESERVED_REGEXP.test(control.value) || WINDOW_RESERVED_NAME_REGEXP.test(control.value)) {
      return { file_name: true };
    }

    if (control.value === '.' || control.value === '..') {
      return { file_name: true };
    }

    return null;
  }
}
