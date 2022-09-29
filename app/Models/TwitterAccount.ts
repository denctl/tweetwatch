import { DateTime } from 'luxon'
import { BaseModel, column, hasMany, HasMany, hasOne, HasOne, belongsTo, BelongsTo } from '@ioc:Adonis/Lucid/Orm'
import User from 'App/Models/User'
import Category from 'App/Models/Category'
import Tweet from 'App/Models/Tweet'

export default class TwitterAccount extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public userId: number

  @column()
  public account: string

  @column()
  public category: string

  @column()
  public category_id: number

  // @column()
  // public category: string

  // @hasOne(() => Category, {
  //   foreignKey: 'id', // defaults to userId
  // })

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @belongsTo(() => User, {
    localKey: 'username'
  })
  public user: BelongsTo<typeof User>

  @hasMany(() => Tweet)
  public tweets: HasMany<typeof Tweet>
}
