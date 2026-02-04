import React from 'react'
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View
} from 'react-native'
import { Button, Icon, Image, Input, Text } from '@rneui/themed'
import { useFormik, FormikHelpers } from 'formik'
import * as Yup from 'yup'
import { COLORS } from '../../../contexts/theme/neutralTheme'
import i18n from '../../../contexts/i18n/i18n'
import useCustomHttpRequest from '../../../hooks/useCustomHttpRequest'
import { API_CONFIG } from '../../../config/apis'
import { AxiosError } from 'axios'
import { AuthResponse } from '../../../db/models/Auth'
import useMessageHandler from '../../../hooks/useErrorHandler'
import { FONTS, SPACING } from '../../../contexts/theme/mccTheme'
import { useNavigation } from '@react-navigation/native'

// Constantes
const { width } = Dimensions.get('window')
const LOGO = require('../../../assets/img/logo.png')

export const ResetPassScreen: React.FC = () => {
  const [isLoading, setIsLoading] = React.useState(false)
  const { post } = useCustomHttpRequest()
  const { handleMessage } = useMessageHandler()
  const navigation = useNavigation<any>()

  const formik = useLoginFormik(async values => {
    try {
      setIsLoading(true)
      await post<AuthResponse>(API_CONFIG.Auth.resetPass, {
        username: values.username
      })
      navigation.navigate('ChangePass', { username: values.username })
    } catch (err) {
      const error = err as AxiosError
      console.log('error', error)
      handleMessage('error', 'resetPasswordErrorRequest')
    } finally {
      setIsLoading(false)
    }
  })

  return (
    <ScrollView style={[styles.container]} keyboardShouldPersistTaps="handled">
      <View style={styles.logoContainer}>
        <Image source={LOGO} style={styles.logo} />
      </View>
      <Text h4 style={styles.title}>
        {i18n.t('changePass')}
      </Text>
      <View style={styles.formikContainer}>
        <Text style={styles.text}>{i18n.t('restPassText')}</Text>
        <FormInput
          field="username"
          label={i18n.t('user')}
          placeholder={i18n.t('username')}
          formik={formik}
        />
        <View style={styles.btnResetPassContainer}>
          <TouchableOpacity
            style={styles.btnResetPass}
            onPress={() => navigation.navigate('ChangePass')}>
            <Text style={styles.textBtnResetPass}>
              {i18n.t('haveCode', { modifier: 'capitalize' })}
            </Text>
          </TouchableOpacity>
        </View>
        <FormButton
          title={i18n.t('continue', { modifier: 'capitalize' })}
          isLoading={isLoading}
          onPress={formik.handleSubmit}
        />

        <FormButton
          title={i18n.t('cancel', { modifier: 'capitalize' })}
          isLoading={isLoading}
          onPress={() => navigation.navigate('Home')}
          type="cancel"
        />
      </View>
    </ScrollView>
  )
}

// Definición de los tipos de valores del formulario
interface LoginValues {
  username: string
}

// Validación con Yup
const getLoginSchema = () => {
  return Yup.object().shape({
    username: Yup.string()
      .min(2, i18n.t('minLengthString', { values: { minLength: 2 } }))
      .max(50, i18n.t('maxLengthString', { values: { maxLength: 50 } }))
      .required(i18n.t('required'))
  })
}

// Función para crear el hook formik con tipado
const useLoginFormik = (
  onSubmit: (
    values: LoginValues,
    formikHelpers: FormikHelpers<LoginValues>
  ) => void
) => {
  return useFormik<LoginValues>({
    initialValues: {
      username: ''
    },
    validationSchema: getLoginSchema(),
    onSubmit
  })
}

// Tipos para el componente FormInput
interface FormInputProps {
  label: string
  placeholder: string
  field: keyof LoginValues
  formik: ReturnType<typeof useLoginFormik>
  secureTextEntry?: boolean
  rightIcon?: boolean
}

// Componente de Input
const FormInput: React.FC<FormInputProps> = props => {
  const { field, formik, secureTextEntry = false } = props
  const [secureEntry, setSecureEntry] = React.useState(secureTextEntry)

  const renderIcon = () => {
    return (
      <TouchableOpacity onPress={() => setSecureEntry(!secureEntry)}>
        <Icon
          name={secureEntry ? 'eye-off' : 'eye'}
          type="ionicon"
          color={secureEntry ? COLORS.grayOpacity : COLORS.primary}
          size={28}
        />
      </TouchableOpacity>
    )
  }

  return (
    <Input
      {...props}
      onChangeText={formik.handleChange(field)}
      onBlur={formik.handleBlur(field)}
      value={formik.values[field]}
      secureTextEntry={secureEntry}
      inputStyle={styles.input}
      autoCapitalize="none"
      autoCorrect={false}
      inputContainerStyle={styles.inputContainer}
      errorMessage={
        formik.touched[field] && formik.errors[field]
          ? formik.errors[field]
          : undefined
      }
      rightIcon={props?.rightIcon && renderIcon()}
    />
  )
}

// Tipos para el componente FormButton
interface FormButtonProps {
  title: string
  isLoading: boolean
  onPress: () => void
  type?: 'cancel'
}

const FormButton: React.FC<FormButtonProps> = ({
  title,
  isLoading,
  onPress,
  type = null
}) => {
  return (
    <Button
      title={title}
      loading={isLoading}
      onPress={onPress}
      loadingProps={{ size: 'small', color: COLORS.white }}
      titleStyle={[
        styles.buttonTitle,
        type === 'cancel' && styles.buttonTitleCancel
      ]}
      buttonStyle={[
        styles.buttonStyle,
        type === 'cancel' && styles.buttonStyleCancel
      ]}
      containerStyle={styles.buttonContainer}
    />
  )
}

// Estilos
const styles = StyleSheet.create({
  text: {
    fontSize: 18,
    lineHeight: 34,
    paddingVertical: SPACING.large,
    textAlign: 'center'
  },
  title: {
    marginTop: SPACING.xLarge,
    textAlign: 'center',
    color: COLORS.primary
  },
  buttonStyleCancel: {
    backgroundColor: 'transparent'
  },
  buttonTitleCancel: {
    color: COLORS.inputText
  },
  container: {
    flex: 1,
    alignContent: 'center',
    backgroundColor: COLORS.background
  },
  logoContainer: {
    marginTop: SPACING.small,
    alignItems: 'center',
    height: 100,
    width
  },
  logo: {
    width,
    height: 150,
    resizeMode: 'contain'
  },
  formikContainer: {
    marginTop: width * 0.1,
    alignItems: 'center',
    paddingHorizontal: 20
  },
  buttonContainer: {
    width: '100%',
    marginTop: SPACING.xLarge,
    paddingHorizontal: SPACING.small
  },
  buttonStyle: {
    backgroundColor: COLORS.primary,
    borderRadius: 5,
    paddingVertical: 10,
    height: 60
  },
  buttonTitle: {
    fontWeight: '700'
  },
  inputContainer: {
    borderColor: COLORS.primary,
    borderWidth: 1,
    borderRadius: 5,
    marginTop: SPACING.small,
    paddingHorizontal: SPACING.small
  },
  input: {
    color: COLORS.primary,
    fontSize: 16
  },
  version: {
    marginVertical: SPACING.xxxLarge * 2,
    fontFamily: FONTS.regular,
    textAlign: 'center',
    color: COLORS.grayOpacity,
    fontSize: 12
  },
  btnResetPassContainer: {
    width: '100%',
    alignItems: 'flex-end',
    paddingHorizontal: SPACING.small
  },
  btnResetPass: {
    height: 40,
    justifyContent: 'center'
  },
  textBtnResetPass: {
    fontSize: 14,
    color: COLORS.buttonBackground
  }
})
