import Realm from 'realm'

export type District = {
  _id: Realm.BSON.ObjectId
  center_point?: string
  created_at?: string
  description?: string
  id?: string
  name?: string
  province_id?: string
  updated_at?: string
}

export const DistrictSchema = {
  name: 'District',
  properties: {
    _id: 'objectId',
    center_point: 'string?',
    created_at: 'string?',
    description: 'string?',
    id: 'string?',
    name: 'string?',
    province_id: 'string?',
    updated_at: 'string?'
  },
  primaryKey: '_id'
}
