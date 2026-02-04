import { Translations } from '../translations'

export const inputsErrors: Translations = {
  default: {
    required: 'Required',
    minLengthString: 'Minimum {{minLength}} caracters',
    maxLengthString: 'Maximum {{maxLength}} caracters',
    numberType: 'Must be a number',
    unique: 'Must be unique',
    min: 'Minimum {{min}} characters',
    max: 'Maximum {{max}} characters',
    atLeastOne: 'At least one element',
    passwordNotMatch: 'Passwords do not match'
  },
  ES: {
    required: 'Obligatorio',
    minLengthString: 'Mínimo {{minLength}} caracteres',
    maxLengthString: 'Máximo {{maxLength}} caracteres',
    numberType: 'Debe ser un número',
    unique: 'Debe ser único',
    min: 'Mínimo {{min}} caracteres',
    max: 'Máximo {{max}} caracteres',
    atLeastOne: 'Al menos un elemento',
    passwordNotMatch: 'Las contraseñas no coinciden'
  }
}
