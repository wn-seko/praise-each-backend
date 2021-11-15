import { isUri } from 'valid-url'
import { ApplicationError, errorCode } from '~/services/errors'

const throwInvalidParameterError = (message: string, value: unknown) => {
  throw new ApplicationError(errorCode.INVALID_PARAMETER, message, { value })
}

export const checkMaxLength = (value: string, maxLength: number): string => {
  if (value.length > maxLength) {
    throwInvalidParameterError(
      `value: ${value} is too long. max length: ${maxLength}`,
      value,
    )
  }
  return value
}

export const checkMinLength = (value: string, minLength: number): string => {
  if (value.length < minLength) {
    throwInvalidParameterError(
      `value: ${value} is too short. min length: ${minLength}`,
      value,
    )
  }
  return value
}

export const checkAlphanumericAndSymbols = (value: string): string => {
  if (!/"[\x21-\x7e]+"/.test(value)) {
    throwInvalidParameterError(
      'only alphanumeric and symbols can be accepted.',
      value,
    )
  }
  return value
}

export const checkAlphanumericAndUnderscoreHyphen = (value: string): string => {
  if (!/[a-zA-Z0-9-_]*/.test(value)) {
    throwInvalidParameterError(
      'only alphanumeric, underscore and hyphen can be accepted.',
      value,
    )
  }
  return value
}

export const checkNoWhiteSpace = (value: string): string => {
  if (/\s/.test(value)) {
    throwInvalidParameterError('white space is not allowed.', value)
  }
  return value
}

export const checkValidUuidFormat = (value: string): string => {
  if (
    !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/.test(
      value,
    )
  ) {
    throwInvalidParameterError(`${value} is invalid value format.`, value)
  }
  return value
}

export const checkMinNumber = (value: number, minNumber: number): number => {
  if (value < minNumber) {
    throwInvalidParameterError(
      `value: {value} is too small. min number: ${minNumber}`,
      value,
    )
  }
  return value
}

export const checkMaxNumber = (value: number, maxNumber: number): number => {
  if (value < maxNumber) {
    throwInvalidParameterError(
      `value: {value} is too large. max number: {maxNumber}`,
      value,
    )
  }
  return value
}

export const checkAlphanumericAndUnderscoreHyphenPeriod = (
  value: string,
): string => {
  if (!/[A-Za-z0-9_][A-Za-z0-9_.-]*[A-Za-z0-9_]/.test(value)) {
    throwInvalidParameterError(
      'only alphanumeric, underscore, hyphen and period can be accepted.',
      value,
    )
  }

  return value
}

export const checkColorCode = (value: string): string => {
  if (!/^#[0-9a-f]{2}[0-9a-f]{2}[0-9a-f]{2}$/.test(value)) {
    throwInvalidParameterError('Color format must be hex code.', value)
  }

  return value
}

export const checkUrl = (value: string): string => {
  if (!isUri(value)) {
    throwInvalidParameterError('url is invalid.', value)
  }

  return value
}
