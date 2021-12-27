import { ValidationError } from '../types/errors/validation';

// eslint-disable-next-line import/prefer-default-export
export const extractValidationError = (
  errors: ValidationError[] | null | undefined,
  key: string,
): ValidationError | null => {
  if (!errors) {
    return null;
  }
  const [msg] = errors.filter((e) => e.loc[1] === key);
  if (!msg) {
    return null;
  }
  return msg;
};
