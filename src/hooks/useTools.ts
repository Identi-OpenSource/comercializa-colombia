import { InpText } from '../components/inputs/text/InpText'
import {
  ModuleSchema,
  ModuleSchemaInstruction
} from '../db/models/ModuleSchemaSchema'
import * as Yup from 'yup'
import { InpOpt } from '../components/inputs/opt/InpOpt'
import { GLOBALS } from '../config/consts'
import { Module } from '../db/models/ModuleSchema'
import { PersonEntity } from '../db/models/PersonEntitySchema'
import i18n from '../contexts/i18n/i18n'
import { InpTypes } from '../components/inputs/types'
import useNetInfo from './useNetInfo'
import { replaceValuesKeysKeys } from '../utils/functions'
import { useSecureStorage } from '../contexts/secure/SecureStorageContext'
import { KEYS_MMKV } from '../db/mmkv'
import axios from 'axios'
import { useRealmQueries } from './useRealmQueries'
import { InpGeoRef } from '../components/inputs/polygon/InpGeoRef'
import { InpPolygon } from '../components/inputs/polygon/InpPolygon'
// import { InpPolygon } from '../components/inputs/polygon/InpPolygon'
// import { InpOptEntity } from '../components/inputs/optEntity/InpOptEntity'

export const inputComponents = {
  text: InpText,
  number: InpText,
  options: InpOpt,
  option: InpOpt,
  entity: InpOpt,
  polygon: InpPolygon,
  location: InpGeoRef
} as { [key: string]: any }

// BLOQUE 1: FUNCIONES PARA VALIDACIONES
const createValidationSchema = (
  inst: ModuleSchemaInstruction,
  module: Module,
  getAllEntities: (entity: string) => any
) => {
  let schema

  // Creamos el esquema en función del tipo de dato
  switch (inst?.metadata?.data_input?.type || inst.schema_gather?.type_value) {
    case 'number':
      schema = Yup.number().typeError(i18n.t('numberType'))
      break
    case 'entity':
    case 'option':
    case 'options':
    case 'polygon':
    case 'location':
      schema = Yup.object().test('atLeastOne', i18n.t('atLeastOne'), obj => {
        return Object.keys(obj).length > 0
      })
      break
    default:
      schema = Yup.string()
      break
  }

  // Aplicar restricciones adicionales (min, max, etc.)
  if (inst.metadata.data_input.max && !(schema instanceof Yup.ObjectSchema)) {
    schema = schema.max(
      Number(inst.metadata.data_input.max),
      i18n.t('max', { values: { max: Number(inst.metadata.data_input.max) } })
    )
  }
  if (inst.metadata.data_input.min && !(schema instanceof Yup.ObjectSchema)) {
    schema = schema.min(
      Number(inst.metadata.data_input.min),
      i18n.t('min', { values: { min: Number(inst.metadata.data_input.min) } })
    )
  }
  if (
    inst.metadata.data_input.min_length &&
    !(schema instanceof Yup.ObjectSchema)
  ) {
    schema = schema.min(
      Number(inst.metadata.data_input.min_length),
      i18n.t('minLengthString', {
        values: { minLength: Number(inst.metadata.data_input.min_length) }
      })
    )
  }
  if (
    inst.metadata.data_input.max_length &&
    !(schema instanceof Yup.ObjectSchema)
  ) {
    schema = schema.max(
      Number(inst.metadata.data_input.max_length),
      i18n.t('maxLengthString', {
        values: { maxLength: Number(inst.metadata.data_input.max_length) }
      })
    )
  }

  // Es requerido
  if (
    !inst?.schema_gather?.is_optional &&
    inst.metadata.data_input.type !== 'option'
  ) {
    schema = schema.required(i18n.t('required'))
  }

  // Validación de unicidad
  if (
    inst?.schema_gather?.is_unique &&
    inst.metadata.data_input.type === 'text' &&
    (schema instanceof Yup.StringSchema || schema instanceof Yup.NumberSchema)
  ) {
    if (schema instanceof Yup.StringSchema) {
      schema = schema.test('unique', i18n.t('unique'), (value: string = '') => {
        return checkUniqueValue(value, inst, module, getAllEntities)
      })
    } else if (schema instanceof Yup.NumberSchema) {
      schema = schema.test('unique', i18n.t('unique'), (value: number = 0) => {
        return checkUniqueValue(value, inst, module, getAllEntities)
      })
    }
  }

  return schema
}

// Función para verificar si el valor es único dentro de un módulo
const checkUniqueValue = (
  value: string | number,
  inst: ModuleSchemaInstruction,
  module: Module | null,
  getAllEntities: (entity: string) => any
): boolean => {
  const entityType = module?.entity_type
    ? GLOBALS.entity_type[module.entity_type]
    : ''

  const entities = getAllEntities(entityType) as PersonEntity[]
  return !entities?.some(entity =>
    entity.module_detail?.some(
      detail => detail?.id === inst.schema_gather.id && detail.value === value
    )
  )
}

// BLOQUE 2: FUNCIONES PARA CREAR ENTRADAS (INPUTS)
const createInput = (
  inst: ModuleSchemaInstruction,
  getAllEntities: (entity: string) => any
): InpTypes => {
  const inp: InpTypes = {
    id: inst.id,
    name: inst.schema_gather.name,
    title: inst.metadata.data_input.title,
    description: inst.metadata.data_input.description,
    type: inst.metadata.data_input.type || inst.schema_gather.type_value,
    inputMode: determineInputMode(inst)
    // component: determineComponent(inst),
  }

  if (
    inst?.metadata?.data_input?.type === 'option' ||
    inst?.metadata?.data_input?.type === 'options'
  ) {
    inp.options = inst.schema_gather.option?.map(opt => ({
      id: opt.id,
      label: opt.value,
      value: { id: opt.id, label: opt.value }
    }))
    inp.disabled = true
  }

  if (
    inst?.metadata?.data_input?.type === 'option' ||
    inst?.metadata?.data_input?.type === 'options' ||
    inst?.metadata?.data_input?.type === 'polygon' ||
    inst?.schema_gather?.type_value === 'polygon' ||
    inst?.metadata?.data_input?.type === 'location' ||
    inst?.schema_gather?.type_value === 'location'
  ) {
    inp.disabled = true
  }
  if (inst?.schema_gather?.type_value === 'entity') {
    inst?.metadata?.data_input?.entity_type?.forEach(entity => {
      const entities = getAllEntities(entity?.description) as PersonEntity[]
      inp.options = entities?.map(ent => {
        const representative = ent?.module_detail?.find(
          en => en.is_representative || en?.name === 'nombre'
        )
        return {
          id: ent?.id as string,
          label: representative?.value as string,
          value: {
            id: ent?.id as string,
            label: representative?.value as string,
            entity_id: ent?.id,
            detail_id: inst?.schema_gather?.id,
            module_name: entity?.display_name,
            entity_type: entity?.description,
            schema_gather: inst?.schema_gather?.id,
            backref: inst?.metadata?.data_input?.backref,
            representative_value: representative?.value
          }
        }
      })
    })
  }

  return inp
}

// Crear el input de location según el tipo de módulo
const createLocationInput = () => {
  const locations = [
    { id: 'country_id', title: 'country' },
    { id: 'department_id', title: 'department' },
    { id: 'province_id', title: 'province' },
    { id: 'district_id', title: 'district' }
  ]
  const inputsLocations = locations.map(location => {
    const inp: InpTypes = {
      id: location?.id,
      name: location?.id,
      title: i18n.t(`${location?.title}`),
      description: '',
      type: 'options',
      component: InpOpt,
      inputMode: 'none'
    }
    const schema = Yup.object()
    return { inp, schema, init: '' }
  })
  return inputsLocations
}

// Función auxiliar para determinar el componente según el tipo de entrada
// const determineComponent = (inst: ModuleSchemaInstruction) => {
//   switch (inst?.metadata?.data_input?.type || inst.schema_gather?.type_value) {
//     case 'text':
//     case 'number':
//       return InpText
//     case 'option':
//     case 'options':
//       return InpOpt
//     case 'entity':
//       return InpOptEntity
//     case 'polygon':
//       return InpGeoRef // InpPolygon
//     default:
//       return InpText // Por defecto, se usa el componente de texto
//   }
// }

// Función auxiliar para determinar el modo de entrada según el tipo de entrada
const determineInputMode = (inst: ModuleSchemaInstruction) => {
  switch (inst?.metadata?.data_input?.type) {
    case 'number':
      return 'numeric'
    case 'entity':
    case 'option':
    case 'options':
    case 'polygon':
    case 'location':
      return 'none'
    case 'text':
    default:
      return 'text'
  }
}

// BLOQUE 3: FUNCIONES PRINCIPALES DEL HOOK
const insAxios = axios.create()

export const useTools = () => {
  const { getItem, setItem } = useSecureStorage()
  const { saveRelationPostOffline } = useRealmQueries()
  const connectionStatus = useNetInfo()
  // Ordena las instrucciones de manera vertical según las condiciones del esquema
  const instructionOrderVertical = (
    moduleSchema: ModuleSchema
  ): ModuleSchemaInstruction[] => {
    const instructionsInOrder: ModuleSchemaInstruction[] = []
    let currentInstruction = moduleSchema.instructions.find(
      inst => inst.id === moduleSchema.instruction_start
    )

    while (currentInstruction) {
      instructionsInOrder.push(currentInstruction)
      const nextInstructionId = currentInstruction.schema_conditions.find(
        condition => condition.type_condition === 'by_success'
      )?.next_instruction_id
      currentInstruction = nextInstructionId
        ? moduleSchema.instructions.find(inst => inst.id === nextInstructionId)
        : undefined
    }

    return instructionsInOrder
  }

  // Generar los inputs y esquemas de validación
  const instructionsGather = (
    instructions: ModuleSchemaInstruction[],
    module: Module,
    getAllEntities: (entity: string) => any
  ) => {
    const gatheredInstructions = instructions.filter(
      inst => inst.config.is_gather
    )
    const inputs: any[] = []
    const initialValues: { [key: string]: any } = {}
    const validationSchema: { [key: string]: any } = {}

    gatheredInstructions.forEach(inst => {
      const input = createInput(inst, getAllEntities)
      inputs.push(input)
      initialValues[input.name] = ''
      validationSchema[input.name] = createValidationSchema(
        inst,
        module,
        getAllEntities
      )
    })

    // Inputs de location, Manual mientras
    if (
      module?.entity_type === GLOBALS.entity_type.PER ||
      module?.entity_type === GLOBALS.entity_type.OBJ
    ) {
      const locationInput = createLocationInput()
      locationInput.forEach(input => {
        inputs.push(input.inp)
        initialValues[input.inp.name] = input.init
        validationSchema[input.inp.name] = input.schema
      })
    }

    return {
      inputs,
      initialValues,
      schemaValidation: Yup.object().shape(validationSchema)
    }
  }

  // Instrucciones post gather
  const instructionsNoGather = (instructions: ModuleSchemaInstruction[]) => {
    return instructions.filter(inst => !inst.config.is_gather)
  }

  const runInstructionPostGather = async () => {
    const stackPostGather = JSON.parse(
      (getItem(KEYS_MMKV.POST_GATHER_STACK) as string) || '[]'
    )
    for (let i = stackPostGather.length - 1; i >= 0; i--) {
      const instruction = stackPostGather[i].inst as ModuleSchemaInstruction
      switch (instruction?.config?.tool?.on_action?.type) {
        case 'api':
          if (connectionStatus) {
            try {
              const resp = await insAxios.post<any>(
                instruction.config.tool.on_action.location,
                replaceValuesKeysKeys(
                  instruction?.metadata?.data_input,
                  stackPostGather[i]?.values
                ),
                {
                  headers: {
                    apiKey: instruction.config.tool.on_action.api_key,
                    tenant: stackPostGather[i].module.tenant,
                    module_session_id: stackPostGather[i].entity_id
                  }
                }
              )
              await saveRelationPostOffline(resp, stackPostGather[i])
              stackPostGather.splice(i, 1)
            } catch (error) {
              console.error('Error runInstructionPostGather:', error)
            }
          }
          break

        default:
          console.log('default')
          break
      }
    }
    setItem(KEYS_MMKV.POST_GATHER_STACK, JSON.stringify(stackPostGather))
  }

  return {
    instructionOrderVertical,
    instructionsGather,
    instructionsNoGather,
    runInstructionPostGather
  }
}
