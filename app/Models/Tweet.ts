import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, BelongsTo } from '@ioc:Adonis/Lucid/Orm'

import TwitterAccount from 'App/Models/TwitterAccount'
import User from 'App/Models/User'

export default class Tweet extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public userId: number

  @column()
  public twitter_accountId: number

  @column()
  public tweet: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @belongsTo(() => User)
  public user: BelongsTo<typeof User>

  @belongsTo(() => TwitterAccount)
  public twitterAccount: BelongsTo<typeof TwitterAccount>
}
