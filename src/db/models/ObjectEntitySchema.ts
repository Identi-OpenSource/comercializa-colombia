/* eslint-disable camelcase */
import Realm from 'realm'

export type ObjectEntity_location = {
  country_id?: string
  department_id?: string
  district_id?: string
  province_id?: string
}

export const ObjectEntity_locationSchema = {
  name: 'ObjectEntity_location',
  embedded: true,
  properties: {
    country_id: 'string?',
    department_id: 'string?',
    district_id: 'string?',
    province_id: 'string?'
  }
}

export type ObjectEntity = {
  _id: Realm.BSON.ObjectId
  created_at?: Date
  entity_relations: any[]
  entity_type?: string
  id?: string
  location?: ObjectEntity_location
  logo_path?: string
  module_detail: any[]
  module_entity_name?: string
  module_id?: string
  module_name?: string
  tenant?: string
  updated_at?: Date
}

export const ObjectEntitySchema = {
  name: 'ObjectEntity',
  properties: {
    _id: 'objectId',
    created_at: 'date?',
    entity_relations: 'mixed[]',
    entity_type: 'string?',
    id: 'string?',
    location: 'ObjectEntity_location',
    logo_path: 'string?',
    module_detail: 'mixed[]',
    module_entity_name: 'string?',
    module_id: 'string?',
    module_name: 'string?',
    tenant: 'string?',
    updated_at: 'date?'
  },
  primaryKey: '_id'
}
