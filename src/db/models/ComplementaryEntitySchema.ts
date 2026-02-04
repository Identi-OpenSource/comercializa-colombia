/* eslint-disable camelcase */
import Realm from 'realm'

export type ComplementaryEntity_module_detail_option = {
  id?: string
  value?: string
}

export const ComplementaryEntity_module_detail_optionSchema = {
  name: 'ComplementaryEntity_module_detail_option',
  embedded: true,
  properties: {
    id: 'string?',
    value: 'string?'
  }
}

export type ComplementaryEntity_module_detail = {
  id?: string
  instruction_id?: string
  is_optional?: boolean
  is_representative?: boolean
  is_unique?: boolean
  name?: string
  option: Realm.List<ComplementaryEntity_module_detail_option>
  order?: string
  type_value?: string
  value?: string
}

export const ComplementaryEntity_module_detailSchema = {
  name: 'ComplementaryEntity_module_detail',
  embedded: true,
  properties: {
    id: 'string?',
    instruction_id: 'string?',
    is_optional: 'bool?',
    is_representative: 'bool?',
    is_unique: 'bool?',
    name: 'string?',
    option: 'ComplementaryEntity_module_detail_option[]',
    order: 'string?',
    type_value: 'string?',
    value: 'string?'
  }
}

export type ComplementaryEntity_entity_relations = {
  backref?: string
  created_at?: Date
  detail_id?: string
  entity_id?: string
  entity_type?: string
  module_name?: string
  representative_value?: string
  type_entity?: string
  var_name?: string
}

export type ComplementaryEntity_location = {
  country_id?: string
  department_id?: string
  district_id?: string
  province_id?: string
}

export const ComplementaryEntity_locationSchema = {
  name: 'ComplementaryEntity_location',
  embedded: true,
  properties: {
    country_id: 'string?',
    department_id: 'string?',
    district_id: 'string?',
    province_id: 'string?'
  }
}

export const ComplementaryEntity_entity_relationsSchema = {
  name: 'ComplementaryEntity_entity_relations',
  embedded: true,
  properties: {
    backref: 'string?',
    created_at: 'date?',
    detail_id: 'string?',
    entity_id: 'string?',
    entity_type: 'string?',
    module_name: 'string?',
    representative_value: 'string?',
    type_entity: 'string?',
    var_name: 'string?'
  }
}

export type ComplementaryEntity = {
  _id: Realm.BSON.ObjectId
  created_at?: Date
  entity_relations: Realm.List<ComplementaryEntity_entity_relations>
  entity_type?: string
  id?: string
  location?: ComplementaryEntity_location
  module_detail: Realm.List<ComplementaryEntity_module_detail>
  module_id?: string
  module_name?: string
  status?: string
  tenant?: string
  updated_at?: Date
}

export const ComplementaryEntitySchema = {
  name: 'ComplementaryEntity',
  properties: {
    _id: 'objectId',
    created_at: 'date?',
    entity_relations: 'ComplementaryEntity_entity_relations[]',
    entity_type: 'string?',
    id: 'string?',
    location: 'ComplementaryEntity_location',
    module_detail: 'ComplementaryEntity_module_detail[]',
    module_id: 'string?',
    module_name: 'string?',
    status: 'string?',
    tenant: 'string?',
    updated_at: 'date?'
  },
  primaryKey: '_id'
}
