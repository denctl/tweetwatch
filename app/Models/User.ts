import { DateTime } from 'luxon'
import Hash from '@ioc:Adonis/Core/Hash'
import { column, beforeSave, BaseModel, manyToMany, ManyToMany, hasMany, HasMany } from '@ioc:Adonis/Lucid/Orm'
import TwitterAccount from 'App/Models/TwitterAccount'
import Tweet from 'App/Models/Tweet'
import Category from 'App/Models/Category'

export default class User extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public username: string

  @column()
  public email: string

  @column({ serializeAs: null })
  public password: string

  @column()
  public rememberMeToken?: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @beforeSave()
  public static async hashPassword (user: User) {
    if (user.$dirty.password) {
      user.password = await Hash.make(user.password)
    }
  }
  @hasMany(() => TwitterAccount)
  public TwitterAccount: HasMany<typeof TwitterAccount>

  @hasMany(() => Tweet)
  public Tweet: HasMany<typeof Tweet>
}
