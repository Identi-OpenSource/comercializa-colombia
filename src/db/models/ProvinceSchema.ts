import Realm from 'realm'

export type Province = {
  _id: Realm.BSON.ObjectId
  center_point?: string
  created_at?: string
  department_id?: string
  description?: string
  id?: string
  name?: string
  updated_at?: string
}

export const ProvinceSchema = {
  name: 'Province',
  properties: {
    _id: 'objectId',
    center_point: 'string?',
    created_at: 'string?',
    department_id: 'string?',
    description: 'string?',
    id: 'string?',
    name: 'string?',
    updated_at: 'string?'
  },
  primaryKey: '_id'
}
