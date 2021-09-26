export const errorCode = {
  /** 認証エラー */
  AUTHENTICATION_ERROR: 'AUTHENTICATION_ERROR' as const,

  /** 不正なリクエストパラメータ */
  INVALID_PARAMETER: 'INVALID_PARAMETER' as const,

  /** 存在しないリソースを参照した */
  NOT_FOUND: 'NOT_FOUND' as const,

  /** リソースを操作する権限がない */
  FORBIDDEN: 'FORBIDDEN' as const,

  /** 重複エラー */
  DUPLICATION_ERROR: 'DUPLICATION_ERROR' as const,

  /** 矛盾したリソースへの変更が行われた */
  RESOURCE_CONFLICT: 'RESOURCE_CONFLICT' as const,

  /** その他のアプリケーションエラー */
  SYSTEM_ERROR: 'SYSTEM_ERROR' as const,
}

export type ErrorCode = keyof typeof errorCode

export class ApplicationError extends Error {
  public readonly code: ErrorCode
  public readonly params: Record<string, unknown>

  constructor(
    code: ErrorCode,
    message: string,
    params?: Record<string, unknown>,
    public readonly innerError?: Error,
  ) {
    super(message)

    this.code = code
    this.params = params || {}
    this.innerError = innerError
  }
}
