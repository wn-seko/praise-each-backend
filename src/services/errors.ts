export class ApplicationError extends Error {
  public readonly code: string
  public readonly params: Record<string, unknown>

  constructor(
    public status: number,
    option: { code: string; params?: Record<string, unknown> },
    public readonly innerError?: Error,
  ) {
    super()

    this.code = option.code
    this.params = option?.params || {}
  }
}
