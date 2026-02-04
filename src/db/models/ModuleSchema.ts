import Realm from 'realm'

export type EntityType = 'PERSON' | 'ORGANIZATION' | 'OBJECT' | 'COMPLEMENTARY'

export type Module = {
  _id: Realm.BSON.ObjectId
  active_end_at?: string
  active_init_at?: string
  entity_type: EntityType
  id: string
  image_path?: string
  module_type?: string
  name?: string
  schema_id: string
  tenant: string
  type_view?: string
  is_conditional?: boolean
}

export const ModuleSchema = {
  name: 'Module',
  properties: {
    _id: 'objectId',
    active_end_at: 'string?',
    active_init_at: 'string?',
    entity_type: 'string?',
    id: 'string',
    image_path: 'string?',
    module_type: 'string?',
    name: 'string?',
    schema_id: 'string',
    tenant: 'string',
    type_view: 'string?',
    is_conditional: 'bool?'
  },
  primaryKey: '_id'
}
