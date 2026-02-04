import {
  NavigationProp,
  RouteProp,
  useNavigation,
  useRoute
} from '@react-navigation/native'
import React, { useLayoutEffect, useState } from 'react'
import { useRealmQueries } from '../../../hooks/useRealmQueries'
import { RootStackParamList } from '../../../router/private'
import { useTools } from '../../../hooks/useTools'
import { FormikContent } from '../../../components/formik/FormikContent'
import { Module } from '../../../db/models/ModuleSchema'
import useMessageHandler from '../../../hooks/useErrorHandler'
import { Container } from '../../../components/container/Container'

export const AddEntity = () => {
  const [isLoading, setIsLoading] = useState(false)
  const navigation = useNavigation<NavigationProp<RootStackParamList>>()
  const { getModuleSchemaById, getAllEntities, saveEntity, getModuleById } =
    useRealmQueries()
  const { handleMessage } = useMessageHandler()
  const { instructionOrderVertical, instructionsGather } = useTools()
  // Datos de la vista
  const route = useRoute<RouteProp<RootStackParamList>>()
  const params = route.params
  // datos del modulo
  const module = getModuleById(params?._id || '') as Module
  // datos del schema
  const moduleSchema = getModuleSchemaById(module?.schema_id || '')
  const insOrder = instructionOrderVertical(moduleSchema)
  const insGather = instructionsGather(insOrder, module, getAllEntities)
  // const insNoGather = instructionsNoGather(insOrder)
  useLayoutEffect(() => {
    navigation.setOptions({ title: module?.name })
  }, [module])
  // console.log('module', module?.schema_id)
  const onSubmit = async (values: any) => {
    setIsLoading(true)
    const isSave = await saveEntity({ values, module, instructions: insOrder })
    if (isSave) {
      handleMessage('success', 'saveSuccess')
      navigation.navigate('ListModules')
    } else {
      handleMessage('error', 'saveError')
    }
    setIsLoading(false)
  }

  const propsFormikContent = {
    initialValues: insGather.initialValues,
    schemaValidation: insGather.schemaValidation,
    inputs: insGather.inputs,
    isLoading,
    onSubmit
  }

  return (
    <Container>
      <FormikContent {...propsFormikContent} />
    </Container>
  )
}
