import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, BelongsTo } from '@ioc:Adonis/Lucid/Orm'

import TwitterAccount from 'App/Models/TwitterAccount'

export default class Tweet extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public account: string

  @column()
  public username: string

  @column()
  public tweet: string

  @column()
  public account_id: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @belongsTo(() => TwitterAccount)
  public twitterAccount: BelongsTo<typeof TwitterAccount>
}
