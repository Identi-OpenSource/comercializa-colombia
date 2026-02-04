import { useQuery, useRealm } from '@realm/react'
import { EntityType, Module } from '../db/models/ModuleSchema'
import { User } from '../db/models/UserSchema'
import { useSecureStorage } from '../contexts/secure/SecureStorageContext'
import { useMemo } from 'react'
import {
  ModuleSchema,
  ModuleSchemaInstruction
} from '../db/models/ModuleSchemaSchema'
import { BSON } from 'realm'
import { PersonEntity } from '../db/models/PersonEntitySchema'
import { GLOBALS } from '../config/consts'
import { Country } from '../db/models/CountrySchema'
import { Department } from '../db/models/DepartmentSchema'
import { Province } from '../db/models/ProvinceSchema'
import { District } from '../db/models/DistrictSchema'
import useNetInfo from './useNetInfo'
import { replaceValuesKeysKeys } from '../utils/functions'
import { KEYS_MMKV } from '../db/mmkv'
import axios from 'axios'
import { ObjectEntity } from '../db/models/ObjectEntitySchema'

const insAxios = axios.create()

export const useRealmQueries = () => {
  const { getItem, setItem } = useSecureStorage()
  const connectionStatus = useNetInfo()
  const { getDataJWT } = useSecureStorage()
  const realm = useRealm()
  const tenant = getDataJWT()?.tenant || ''
  const uuidUser = getDataJWT()?.uuid || ''

  const allModules = useQuery<Module>('Module')
  const allModuleSchemas = useQuery<ModuleSchema>('ModuleSchema')
  const users = useQuery<User>('User')
  const personEntity = useQuery<PersonEntity>('PersonEntity')
  const country = useQuery<Country>('Country')
  const department = useQuery<Department>('Department')
  const province = useQuery<Province>('Province')
  const district = useQuery<District>('District')

  // obtener module por id

  const getModuleById = useMemo(
    () => (id: string) => {
      const _id = new BSON.ObjectId(id)
      return allModules.filtered('_id == $0', _id)?.[0]
    },
    [tenant, allModules]
  )

  const getModules = useMemo(() => {
    return allModules.filtered('tenant == $0', tenant)
  }, [tenant, allModules])

  const getModuleSchemaById = useMemo(
    () => (id: string) => {
      return allModuleSchemas.filtered('id == $0', id)?.[0]
    },
    [tenant, allModuleSchemas]
  )

  const getUser = useMemo(() => {
    const user = users.filtered('uuid == $0', uuidUser)
    return user.length > 0 ? user[0] : undefined
  }, [uuidUser, users])

  const getPersonEntity = useMemo(() => {
    const persons = personEntity.filtered('tenant == $0', tenant)
    return persons.length > 0 ? persons : undefined
  }, [uuidUser])

  const getCountry = useMemo(() => {
    return country.length > 0 ? country : []
  }, [country])

  const getDepartment = useMemo(
    () => (id: string) => {
      const departmentList = department.filtered('country_id == $0', id)
      return departmentList.length > 0 ? departmentList : []
    },
    [department]
  )

  const getProvince = useMemo(
    () => (id: string) => {
      const provinceList = province.filtered('department_id == $0', id)
      return provinceList.length > 0 ? provinceList : []
    },
    [province]
  )

  const getDistrict = useMemo(
    () => (id: string) => {
      const districtList = district.filtered('province_id == $0', id)
      return districtList.length > 0 ? districtList : []
    },
    [district]
  )

  const getAllEntities = useMemo(
    () => (entity: string) => {
      switch (entity) {
        case GLOBALS.entity_type.PER:
        case GLOBALS.entity_type.PERSON:
          return getPersonEntity

        default:
          break
      }
    },
    []
  )

  const saveEntity = async ({
    values,
    module,
    instructions
  }: {
    values: any
    module: Module
    instructions: ModuleSchemaInstruction[]
  }) => {
    const entityType = GLOBALS.entity_type[module.entity_type]
    const id = new BSON.UUID().toString()
    const _id = new BSON.ObjectId()
    const postCreateRelations: any[] = []

    const representativeValue = getRepresentativeValue(values, instructions)

    const doc = createDocument(_id, id, module)

    // Si existe ubicación, la añadimos
    doc.location = getLocation(values)

    // Procesar cada instrucción
    for (const inst of instructions) {
      if (inst.config.is_gather) {
        processInstruction(
          inst,
          values,
          doc,
          postCreateRelations,
          module,
          id,
          representativeValue
        )
      }

      // Si la instrucción es un API, manejar la lógica correspondiente
      if (inst.config.tool?.on_action?.type === 'api') {
        await handleApiAction(inst, values, module, id, doc)
      }
    }

    // Guardar en la base de datos Realm
    return saveToRealm(doc, entityType, postCreateRelations, tenant)
  }

  // Función para obtener el valor representativo
  const getRepresentativeValue = (
    values: any,
    instructions: ModuleSchemaInstruction[]
  ): string => {
    return (
      values[
        instructions?.find(instAll => instAll.schema_gather?.is_representative)
          ?.schema_gather?.name as string
      ] ?? ''
    )
  }

  // Crear el documento principal
  const createDocument = (
    _id: BSON.ObjectId,
    id: string,
    module: Module
  ): PersonEntity | ObjectEntity => {
    return {
      _id,
      id,
      tenant: module.tenant,
      module_name: module.name,
      module_id: module.id,
      entity_type: module.entity_type,
      updated_at: new Date(),
      created_at: new Date(),
      module_detail: [],
      entity_relations: []
    }
  }

  // Obtener la ubicación si existe
  const getLocation = (values: any) => {
    if (
      values?.country_id?.id ||
      values?.department_id?.id ||
      values?.province_id?.id ||
      values?.district_id?.id
    ) {
      return {
        country_id: values?.country_id?.id ?? '',
        department_id: values?.department_id?.id ?? '',
        province_id: values?.province_id?.id ?? '',
        district_id: values?.district_id?.id ?? ''
      }
    }
    return undefined
  }

  // Procesar cada instrucción de recopilación
  const processInstruction = (
    inst: ModuleSchemaInstruction,
    values: any,
    doc: any,
    postCreateRelations: any[],
    module: Module,
    id: string,
    representativeValue: string
  ) => {
    let value = ''
    switch (inst.schema_gather?.type_value) {
      case 'option':
        value = values[inst.schema_gather.name]?.label
        break
      case 'entity':
        value = values[inst.schema_gather.name]?.id
        doc.entity_relations.push({
          ...values[inst.schema_gather.name],
          created_at: new Date()
        })
        postCreateRelations.push(
          createRelation(values, inst, id, module, representativeValue)
        )
        break
      default:
        value = values[inst.schema_gather.name]
        break
    }

    const detail = {
      ...inst.schema_gather,
      instruction_id: inst.id,
      value
    }
    doc.module_detail.push(detail)
  }

  // Crear relación entre entidades
  const createRelation = (
    values: any,
    inst: ModuleSchemaInstruction,
    id: string,
    module: Module,
    representativeValue: string
  ) => {
    return {
      entity_id: id,
      id: values[inst.schema_gather.name].id,
      collection: values[inst.schema_gather.name].entity_type,
      entity_type: module.entity_type,
      backref: inst.metadata.data_input.backref,
      created_at: new Date(),
      module_name: module.name,
      representative_value: representativeValue
    }
  }

  // Manejar la acción de API
  const handleApiAction = async (
    inst: ModuleSchemaInstruction,
    values: any,
    module: Module,
    id: string,
    doc: any
  ) => {
    let POST_GATHER_STACK = connectionStatus
    if (!connectionStatus) {
      try {
        const resp = await insAxios.post<any>(
          inst.config.tool.on_action.location,
          replaceValuesKeysKeys(inst?.metadata?.data_input, values),
          {
            headers: {
              apiKey: inst.config.tool.on_action.api_key,
              tenant: module.tenant,
              module_session_id: id
            }
          }
        )
        processApiResponse(resp, inst, doc)
      } catch (error) {
        console.error('Error apiTool:', error)
        POST_GATHER_STACK = true
      }
    }

    if (POST_GATHER_STACK) {
      addToPostGatherStack(values, inst, module, id)
    }
  }

  // Procesar la respuesta del API
  const processApiResponse = (
    resp: any,
    inst: ModuleSchemaInstruction,
    doc: any
  ) => {
    const respData = resp?.data?.data
    inst?.schema_variables?.forEach(variable => {
      if (
        respData?.[variable?.name] &&
        variable?.is_module_attr &&
        variable?.list_type_value !== 'entity'
      ) {
        const detail = {
          name: variable?.name,
          instruction_id: inst?.id,
          value: respData?.[variable?.name]
        }
        doc.module_detail.push(detail)
      }
      if (
        respData?.[variable?.name] &&
        variable?.is_module_attr &&
        variable?.list_type_value === 'entity'
      ) {
        doc.entity_relations.push(...respData?.[variable?.name])
      }
    })
  }

  // Agregar a la pila de POST_GATHER_STACK
  const addToPostGatherStack = (
    values: any,
    inst: ModuleSchemaInstruction,
    module: Module,
    id: string
  ) => {
    const apiTool = {
      _id: values._id,
      id: values.id,
      entity_type: module.entity_type,
      inst,
      values,
      entity_id: id,
      module
    }
    const stackPostGather = JSON.parse(
      (getItem(KEYS_MMKV.POST_GATHER_STACK) as string) || '[]'
    )
    stackPostGather.push(apiTool)
    setItem(KEYS_MMKV.POST_GATHER_STACK, JSON.stringify(stackPostGather))
  }

  // Guardar en Realm
  const saveToRealm = (
    doc: any,
    entityType: string,
    postCreateRelations: any[],
    tenant: string
  ) => {
    try {
      realm.write(() => {
        realm.create(entityType, doc)

        // Agregar relaciones entre entidades
        postCreateRelations?.forEach(item => {
          const entityTypeRelation =
            GLOBALS.entity_type[item.collection as EntityType]
          const entityRelation =
            realm
              .objects<PersonEntity | ObjectEntity>(entityTypeRelation)
              .filtered('id == $0 AND tenant == $1', item.id, tenant)[0] ?? null
          if (entityRelation) {
            entityRelation.entity_relations.push(item)
          }
        })
      })
      return true
    } catch (error) {
      console.error('Error al guardar el entity:', error)
      return false
    }
  }

  // saveRelation post offline

  const saveRelationPostOffline = async (resp: any, item: any) => {
    try {
      const entityType = GLOBALS.entity_type[item?.entity_type as EntityType]
      const doc = realm
        .objects(entityType)
        .filtered('id == $0', item?.entity_id)[0]
      if (doc) {
        realm.write(() => {
          processApiResponse(resp, item?.inst, doc)
        })
      }
    } catch (error) {
      console.error('Error al guardar la relación:', error)
    }
  }

  return {
    saveEntity,
    getModules,
    getModuleSchemaById,
    getUser,
    getPersonEntity,
    getAllEntities,
    getCountry,
    getDepartment,
    getProvince,
    getDistrict,
    getModuleById,
    saveRelationPostOffline
  }
}

// Custom hook para obtener un Module por su id directamente sin useMemo
// export const useModuleById = (_id: string) => {
//   const id = new BSON.ObjectId(_id)
//   const module = useObject<Module>('Module', id)

//   return module
// }
