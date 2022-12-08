import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, BelongsTo } from '@ioc:Adonis/Lucid/Orm'

export default class Tweet extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public twitterAccountId: number

  @column()
  public tweet: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
