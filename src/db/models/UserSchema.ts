import Realm from 'realm'

export const CONST_USER = {
  status: {
    confirmed: 'CONFIRMED',
    force_change_password: 'FORCE_CHANGE_PASSWORD'
  }
}

export type User = {
  _id?: Realm.BSON.ObjectId
  cell_number?: string
  country?: string
  country_id?: string
  created_at?: string
  department_id?: string
  disabled?: boolean
  district_id?: string
  eid?: string
  email?: string
  exp?: number
  first_name?: string
  is_visible?: boolean
  last_name?: string
  location?: string
  logo_path?: string
  organization_admin_tenant?: string
  parent_app_id?: string
  parent_entity_id?: string
  province_id?: string
  roles: Realm.List<string>
  scopes: Realm.List<string>
  sms_number?: string
  tenant: string
  type?: string
  updated_at?: string
  user_status?: string
  username?: string
  uuid: string
  wsp_number?: string
}

export const UserSchema = {
  name: 'User',
  properties: {
    _id: 'objectId',
    cell_number: 'string?',
    country: 'string?',
    country_id: 'string?',
    created_at: 'string?',
    department_id: 'string?',
    disabled: 'bool?',
    district_id: 'string?',
    eid: 'string?',
    email: 'string?',
    exp: 'int?',
    first_name: 'string?',
    is_visible: 'bool?',
    last_name: 'string?',
    location: 'string?',
    logo_path: 'string?',
    organization_admin_tenant: 'string?',
    parent_app_id: 'string?',
    parent_entity_id: 'string?',
    province_id: 'string?',
    roles: 'string[]',
    scopes: 'string[]',
    sms_number: 'string?',
    tenant: 'string',
    type: 'string?',
    updated_at: 'string?',
    user_status: 'string?',
    username: 'string?',
    uuid: 'string',
    wsp_number: 'string?'
  },
  primaryKey: '_id'
}
