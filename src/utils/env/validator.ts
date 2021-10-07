import { NodeEnv } from './environment'

type Validate = (v: string | undefined) => boolean
type Convert<ConvertedValue> = (v: string) => ConvertedValue

const initialConvertedValueSymbol = Symbol('initialConvertedValue')
const initialConvertedValue = {
  [initialConvertedValueSymbol]: true,
}

type InitialConvertedValue = typeof initialConvertedValue

const makeValidator = <ConvertedValue = InitialConvertedValue>(
  validate: Validate,
  convert?: Convert<ConvertedValue>,
) => {
  return (
    key: string,
  ): ConvertedValue extends InitialConvertedValue ? string : ConvertedValue => {
    // eslint-disable-next-line no-process-env
    const rawValue = process.env[key]
    if (!validate(rawValue)) {
      throw new Error(`環境変数 ${key} が不正です。(値: ${rawValue})`)
    }

    const value = rawValue as string
    const result = convert != null ? convert(value) : value

    return result as ConvertedValue extends InitialConvertedValue
      ? string
      : ConvertedValue
  }
}

export const toNodeEnv = makeValidator<NodeEnv>(
  (v) => v === 'development' || v === 'production' || v === 'test',
)

export const toString = makeValidator<string>((v) => typeof v === 'string')

export const toStringOrUndefined = makeValidator(
  (v) => typeof v === 'string' || typeof v === 'undefined',
  (v) => (typeof v === 'string' ? v : undefined),
)

export const toNumberOrUndefined = makeValidator<number | undefined>(
  (v) => typeof v === 'undefined' || !isNaN(Number(v)),
  (v) => (typeof v === 'undefined' ? undefined : Number(v)),
)
