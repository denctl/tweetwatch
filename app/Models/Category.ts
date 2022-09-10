import { DateTime } from 'luxon'
import { BaseModel, column, hasMany, HasMany } from '@ioc:Adonis/Lucid/Orm'
import TwitterAccount from 'App/Models/TwitterAccount'

export default class Category extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public category: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
