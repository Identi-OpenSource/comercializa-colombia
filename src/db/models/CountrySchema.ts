import Realm from 'realm'

export type Country = {
  _id: Realm.BSON.ObjectId
  code?: string
  description?: string
  id?: string
  name?: string
}

export const CountrySchema = {
  name: 'Country',
  properties: {
    _id: 'objectId',
    code: 'string?',
    description: 'string?',
    id: 'string?',
    name: 'string?'
  },
  primaryKey: '_id'
}
