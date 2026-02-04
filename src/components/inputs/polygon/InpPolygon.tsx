import React from 'react'
import { View } from 'react-native'
import { InpTextProps } from '../types'
import { Input } from '@rneui/base'
import {
  COLORS,
  INPUTS_STYLES,
  SPACING
} from '../../../contexts/theme/mccTheme'
import { useField, useFormikContext } from 'formik'

export const InpPolygon = (props: InpTextProps) => {
  const [field, meta] = useField(props.name)
  const { setFieldValue } = useFormikContext()
  const { onBlur, name } = field
  const input = React.useRef<any>(null)

  const isError = meta.error !== undefined && meta.touched

  return (
    <View>
      <Input
        ref={input}
        label={props?.title}
        placeholder={props?.description}
        inputMode={props?.inputMode ?? 'none'}
        onChangeText={text => setFieldValue(name, text)}
        onBlur={onBlur(name)}
        errorMessage={isError ? (meta.error as string) : undefined}
        labelProps={{ style: INPUTS_STYLES.title }}
        inputStyle={INPUTS_STYLES.inp}
        inputContainerStyle={INPUTS_STYLES.impContainer}
        placeholderTextColor={COLORS.grayOpacity}
        hitSlop={SPACING.hitSlop}
      />
    </View>
  )
}
