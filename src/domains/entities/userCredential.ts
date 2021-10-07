import dayjs, { Dayjs } from 'dayjs'
import {
  checkValidUuidFormat,
  checkMinLength,
  checkMaxLength,
} from '../validator'

interface Props {
  userId: string
  oauthId: string
  oauthType: 'github'
}

export type UserCredentialType = Props & {
  createdAt: Dayjs
  updatedAt: Dayjs
}

export type UserCredentialResponse = Omit<
  UserCredentialType,
  'createdAt' | 'updatedAt'
> & {
  createdAt: string
  updatedAt: string
}

export class UserCredential {
  public readonly userId: string
  public oauthId: string
  public oauthType: 'github'
  public createdAt: Dayjs
  public updatedAt: Dayjs

  constructor(user: UserCredentialType | Props) {
    this.userId = this.checkId(user.userId)
    this.oauthId = this.checkOAuthId(user.oauthId)
    this.oauthType = user.oauthType
    this.createdAt = 'createdAt' in user ? user.createdAt : dayjs()
    this.updatedAt = this.createdAt.clone()
  }

  private checkId(value: string): string {
    checkValidUuidFormat(value)
    return value
  }

  private checkOAuthId(value: string): string {
    checkMinLength(value, 1)
    checkMaxLength(value, 100)
    return value
  }

  public update(props: Partial<Props>): void {
    this.oauthId = props.oauthId ?? this.oauthId
    this.oauthType = props.oauthType ?? this.oauthType
    this.updatedAt = dayjs()
  }

  public toJSON(): UserCredentialResponse {
    return {
      userId: this.userId,
      oauthId: this.oauthId,
      oauthType: this.oauthType,
      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt.toISOString(),
    }
  }
}
