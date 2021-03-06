import dayjs from 'dayjs'
import {
  Praise,
  PraiseQueryParams,
  PraiseType,
} from '~/domains/entities/praise'
import { PraiseLike } from '~/domains/entities/praiseLike'
import { PraiseStamp } from '~/domains/entities/praiseStamp'
import { PraiseUpVote } from '~/domains/entities/praiseUpVote'
import { PraiseRepository } from '~/domains/repositories/praise'
import { knex } from '~/infrastructures/database'

interface DbPraiseProps {
  id: string
  from: string
  to: string
  message: string
  tags: string[]
  created_at: string
  updated_at: string
}

interface DbPraiseType extends DbPraiseProps {
  likes: string[]
  up_votes: string[]
  stamps: string
}

interface DbPraiseLike {
  praise_id: string
  user_id: string
  created_at: string
}

interface DbPraiseUpVote {
  praise_id: string
  user_id: string
  created_at: string
}

interface DbPraiseStamp {
  praise_id: string
  user_id: string
  stamp_id: string
  created_at: string
}

interface WhereQueryOptions {
  id?: string
  from?: string | string[]
  to?: string | string[]
}

interface PaginationOptions {
  limit?: number
  offset?: number
}

const sanitizeQuery = (queryParams: PraiseQueryParams) =>
  Object.fromEntries(Object.entries(queryParams).filter(([, v]) => v != null))

const resultToPraise = (result: DbPraiseType): Praise => {
  return new Praise({
    ...result,
    likes: (result.likes || []).filter((item) => !!item),
    upVotes: (result.up_votes || []).filter((item) => !!item),
    stamps: stampResultToStamp(result.stamps),
    createdAt: dayjs(result.created_at),
    updatedAt: dayjs(result.updated_at),
  })
}

const praiseToDbType = (praise: PraiseType): DbPraiseProps => ({
  id: praise.id,
  from: praise.from,
  to: praise.to,
  message: praise.message,
  tags: praise.tags,
  created_at: praise.createdAt.toISOString(),
  updated_at: praise.updatedAt.toISOString(),
})

const praiseLikeToDbType = (like: PraiseLike): DbPraiseLike => ({
  praise_id: like.praiseId,
  user_id: like.userId,
  created_at: like.createdAt.toISOString(),
})

const praiseUpVoteToDbType = (upVote: PraiseUpVote): DbPraiseUpVote => ({
  praise_id: upVote.praiseId,
  user_id: upVote.userId,
  created_at: upVote.createdAt.toISOString(),
})

const praiseStampToDbType = (stamp: PraiseStamp): DbPraiseStamp => ({
  praise_id: stamp.praiseId,
  user_id: stamp.userId,
  stamp_id: stamp.stampId,
  created_at: stamp.createdAt.toISOString(),
})

const stampResultToStamp = (
  tupleString: string,
): Array<{ stampId: string; userIds: string[] }> => {
  const arrayOfUserIdAndStampId = tupleToArray(tupleString)
  const stampObjects = arrayOfUserIdAndStampId.map(
    (userIdAntStampId) =>
      Object.fromEntries([
        ['userId', userIdAntStampId[0]],
        ['stampId', userIdAntStampId[1]],
      ]) as { userId: string; stampId: string },
  )

  const stamps = stampObjects
    .filter((item) => !!item.userId && !!item.stampId)
    .reduce((memo, item) => {
      const updated = memo.map((memoItem) =>
        memoItem.stampId === item.stampId
          ? { ...memoItem, userIds: memoItem.userIds.concat([item.userId]) }
          : memoItem,
      )

      const isNew =
        memo.findIndex((memoItem) => memoItem.stampId === item.stampId) === -1

      if (isNew) {
        updated.push({ stampId: item.stampId, userIds: [item.userId] })
      }

      return updated
    }, [] as Array<{ stampId: string; userIds: string[] }>)

  return stamps
}

const tupleToArray = (tupleString: string): string[][] => {
  try {
    return JSON.parse(
      tupleString
        .replace(/\{/g, '[')
        .replace(/\}/g, ']')
        .replace(/\(/g, '')
        .replace(/\)/g, ''),
    ).map((item: string) => item.split(','))
  } catch (e) {
    return []
  }
}

const buildGetPraisesQuery = (
  options: WhereQueryOptions,
  pagination?: PaginationOptions,
) => {
  const whereOptions: { from?: string; to?: string } = {}
  let baseQuery = knex.select('*').from('praises')

  if (options.id) {
    baseQuery = baseQuery.where({ id: options.id })
  }

  if (options.from) {
    if (typeof options.from === 'string') {
      whereOptions.from = options.from
    } else {
      baseQuery = baseQuery.whereIn('from', options.from)
    }
  }

  if (options.to) {
    if (typeof options.to === 'string') {
      whereOptions.to = options.to
    } else {
      baseQuery = baseQuery.whereIn('to', options.to)
    }
  }

  baseQuery = Object.keys(whereOptions).length
    ? baseQuery.where(options)
    : baseQuery

  baseQuery = baseQuery = baseQuery.as('p')

  const joinPraiseLikeQuery = knex
    .select(['p.*', knex.raw('ARRAY_AGG(praise_likes.user_id) as likes')])
    .from(baseQuery)
    .leftJoin('praise_likes', 'p.id', 'praise_likes.praise_id')
    .groupBy(
      'p.id',
      'p.from',
      'p.to',
      'p.message',
      'p.tags',
      'p.created_at',
      'p.updated_at',
      'praise_likes.praise_id',
    )
    .as('t1')

  const joinPraiseUpVoteQuery = knex
    .select([
      't1.*',
      knex.raw('ARRAY_AGG(praise_up_votes.user_id) as up_votes'),
    ])
    .from(joinPraiseLikeQuery)
    .leftJoin('praise_up_votes', 't1.id', 'praise_up_votes.praise_id')
    .groupBy(
      't1.id',
      't1.from',
      't1.to',
      't1.message',
      't1.tags',
      't1.likes',
      't1.created_at',
      't1.updated_at',
      'praise_up_votes.praise_id',
    )
    .as('t2')

  let mainQuery = knex
    .select<DbPraiseType[]>([
      't2.*',
      knex.raw(
        'ARRAY_AGG((praise_stamps.user_id, praise_stamps.stamp_id) ORDER BY praise_stamps.created_at ASC) as stamps',
      ),
    ])
    .from(joinPraiseUpVoteQuery)
    .leftJoin('praise_stamps', 't2.id', 'praise_stamps.praise_id')
    .groupBy(
      't2.id',
      't2.from',
      't2.to',
      't2.message',
      't2.tags',
      't2.likes',
      't2.up_votes',
      't2.created_at',
      't2.updated_at',
      'praise_stamps.praise_id',
    )
    .orderBy('t2.created_at', 'desc')

  if (pagination?.offset) {
    mainQuery = mainQuery.offset(pagination.offset)
  }

  if (pagination?.limit) {
    mainQuery = mainQuery.limit(pagination.limit)
  }

  return mainQuery
}

export class SQLPraiseRepository implements PraiseRepository {
  async create(praise: Praise): Promise<Praise> {
    const results = await knex<DbPraiseType>('praises').insert(
      praiseToDbType(praise),
      '*',
    )
    return resultToPraise(results[0])
  }

  async getById(id: string): Promise<Praise | undefined> {
    const result = await buildGetPraisesQuery({ id }).first()
    return result ? resultToPraise(result) : undefined
  }

  async getList(queryParams: PraiseQueryParams): Promise<Praise[]> {
    try {
      const sanitizedWhereOptions = sanitizeQuery(queryParams)
      const { offset, limit, ...whereOptions } = sanitizedWhereOptions
      const results = await buildGetPraisesQuery(whereOptions, {
        offset,
        limit,
      })
      return results.map(resultToPraise)
    } catch (e) {
      console.error(e)
      return new Promise((r) => r([]))
    }
  }

  async update(praise: PraiseType): Promise<Praise> {
    const [updated] = await knex<DbPraiseType>('praises')
      .where('id', praise.id)
      .update(praiseToDbType(praise), '*')
    return resultToPraise(updated)
  }

  async deleteById(id: string): Promise<string> {
    await knex<PraiseType>('praises').where({ id }).del<PraiseType>()
    return id
  }

  async createLike(like: PraiseLike): Promise<Praise> {
    await knex<DbPraiseLike>('praise_likes').insert(praiseLikeToDbType(like))

    const result = await buildGetPraisesQuery({ id: like.praiseId }).first()
    return resultToPraise(result)
  }

  async deleteLike(like: PraiseLike): Promise<Praise> {
    await knex<DbPraiseLike>('praise_likes')
      .where({ praise_id: like.praiseId, user_id: like.userId })
      .delete()

    const result = await buildGetPraisesQuery({ id: like.praiseId }).first()
    return resultToPraise(result)
  }

  async createUpVote(upVote: PraiseUpVote): Promise<Praise> {
    await knex<DbPraiseUpVote>('praise_up_votes').insert(
      praiseUpVoteToDbType(upVote),
    )

    const result = await buildGetPraisesQuery({ id: upVote.praiseId }).first()
    return resultToPraise(result)
  }

  async deleteUpVote(upVote: PraiseUpVote): Promise<Praise> {
    await knex<DbPraiseUpVote>('praise_up_votes')
      .where({ praise_id: upVote.praiseId, user_id: upVote.userId })
      .delete()

    const result = await buildGetPraisesQuery({ id: upVote.praiseId }).first()
    return resultToPraise(result)
  }

  async createStamp(stamp: PraiseStamp): Promise<Praise> {
    await knex<DbPraiseStamp>('praise_stamps').insert(
      praiseStampToDbType(stamp),
    )

    const result = await buildGetPraisesQuery({ id: stamp.praiseId }).first()
    return resultToPraise(result)
  }

  async deleteStamp(stamp: PraiseStamp): Promise<Praise> {
    await knex<DbPraiseStamp>('praise_stamps')
      .where({
        praise_id: stamp.praiseId,
        user_id: stamp.userId,
        stamp_id: stamp.stampId,
      })
      .delete()

    const result = await buildGetPraisesQuery({ id: stamp.praiseId }).first()
    return resultToPraise(result)
  }
}
