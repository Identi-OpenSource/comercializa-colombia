import Realm from 'realm'

export type Department = {
  _id: Realm.BSON.ObjectId
  center_point?: string
  country_id?: string
  created_at?: string
  description?: string
  id?: string
  name?: string
  updated_at?: string
}

export const DepartmentSchema = {
  name: 'Department',
  properties: {
    _id: 'objectId',
    center_point: 'string?',
    country_id: 'string?',
    created_at: 'string?',
    description: 'string?',
    id: 'string?',
    name: 'string?',
    updated_at: 'string?'
  },
  primaryKey: '_id'
}
