import React, { useEffect, useState } from 'react'
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native'
import { InpTextProps, OptionsItem } from '../types'
import { Input } from '@rneui/base'
import { Dialog, ListItem } from '@rneui/themed'
import { useRealmQueries } from '../../../hooks/useRealmQueries'
import { firstLetterOfEachWordCapitalized } from '../../../utils/textsUtils'
import {
  COLORS,
  INPUTS_STYLES,
  SPACING
} from '../../../contexts/theme/mccTheme'
import { useField, useFormikContext } from 'formik'

export const InpOpt = (props: InpTextProps) => {
  const [visible, setVisible] = useState(false)
  const [options, setOptions] = useState<OptionsItem[]>(props.options ?? [])
  const [field, meta] = useField(props.name)
  const { setFieldValue, values } = useFormikContext()
  const { onBlur, name, value } = field

  const isError = meta.error !== undefined && meta.touched
  const input = React.useRef<any>(null)

  // OPCIONES DE LOCACIÓN, MIENTRAS ES MANUAL
  const { getCountry, getDepartment, getProvince, getDistrict } =
    useRealmQueries()
  useEffect(() => {
    // Mapa de funciones según el nombre del campo, con `fetch` como una función o directamente los datos
    const optionsMap: { [key: string]: { fetch: any; depValue?: string } } = {
      country_id: { fetch: getCountry },
      department_id: { fetch: getDepartment((values as any).country_id?.id) },
      province_id: { fetch: getProvince((values as any).department_id?.id) },
      district_id: { fetch: getDistrict((values as any).province_id?.id) }
    }

    // Verifica si el `name` actual está en el mapa
    if (name in optionsMap) {
      const { fetch } = optionsMap[name]

      // Aquí `fetch` ya es el resultado (no es una función), por lo que mapeamos directamente
      const data = fetch
      // Mapea las opciones si los datos existen
      const opts = data?.map((item: any) => ({
        id: item?.id as string,
        label: firstLetterOfEachWordCapitalized(item?.name) as string,
        value: {
          id: item?.id as string,
          label: firstLetterOfEachWordCapitalized(item?.name) as string
        }
      }))

      // Asignar las opciones
      setOptions(opts)
    }
  }, [
    (values as any)?.country_id?.id,
    (values as any)?.department_id?.id,
    (values as any)?.province_id?.id
  ])

  const resetValue = () => {
    switch (name) {
      case 'country_id':
        setFieldValue('department_id', '')
        setFieldValue('province_id', '')
        setFieldValue('district_id', '')
        break
      case 'department_id':
        setFieldValue('province_id', '')
        setFieldValue('district_id', '')
        break
      case 'province_id':
        setFieldValue('district_id', '')
        break
      default:
        break
    }
  }

  // FIN OPCIONES DE LOCACIÓN

  const onPressItem = (val: { id: string; label: string }) => {
    setFieldValue(name, val)
    setVisible(!visible)
    resetValue()
  }

  return (
    <View>
      <TouchableOpacity
        onPress={() => setVisible(!visible)}
        hitSlop={SPACING.hitSlopCorto}
        activeOpacity={0.8}>
        <Input
          ref={input}
          label={props?.title}
          placeholder={props?.description}
          inputMode={props?.inputMode ?? 'none'}
          disabled={props?.disabled ?? true}
          value={value?.label ?? ''}
          onChangeText={text => setFieldValue(name, text)}
          onBlur={onBlur(name)}
          errorMessage={isError ? (meta.error as string) : undefined}
          labelProps={{ style: INPUTS_STYLES.title }}
          inputStyle={INPUTS_STYLES.inp}
          inputContainerStyle={INPUTS_STYLES.impContainer}
          placeholderTextColor={COLORS.grayOpacity}
        />
      </TouchableOpacity>
      <Dialog
        isVisible={visible}
        overlayStyle={styles.overlay}
        onBackdropPress={() => setVisible(false)}>
        <Dialog.Title title={props?.title} titleStyle={INPUTS_STYLES.title} />
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled">
          {options
            ?.sort((a: any, b: any) => {
              return a.label.localeCompare(b.label)
            })
            ?.map(item => (
              <ListItem
                key={item?.id}
                onPress={() => onPressItem(item?.value)}
                bottomDivider>
                <ListItem.Content>
                  <ListItem.Title style={INPUTS_STYLES.inpOpt}>
                    {item?.label}
                  </ListItem.Title>
                </ListItem.Content>
                <ListItem.Chevron size={20} color={COLORS.primary} />
              </ListItem>
            ))}
        </ScrollView>
      </Dialog>
    </View>
  )
}

const styles = StyleSheet.create({
  overlay: {
    width: '90%',
    maxHeight: '90%'
  }
})
