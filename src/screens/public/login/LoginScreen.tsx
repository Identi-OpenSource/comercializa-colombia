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
import Config from 'react-native-config'
import { AxiosError } from 'axios'
import { KEYS_MMKV } from '../../../db/mmkv'
import { AuthResponse } from '../../../db/models/Auth'
import { useAuthLocal } from '../../../contexts/auth/AuthContext'
import { useSecureStorage } from '../../../contexts/secure/SecureStorageContext'
import useMessageHandler from '../../../hooks/useErrorHandler'
import { FONTS, SPACING } from '../../../contexts/theme/mccTheme'
import { useNavigation } from '@react-navigation/native'

// Constantes
const { width } = Dimensions.get('window')
const LOGO = require('../../../assets/img/logo.png')

// Función principal del LoginScreen
export const LoginScreen: React.FC = () => {
  const [isLoading, setIsLoading] = React.useState(false)
  const { post } = useCustomHttpRequest()
  const { setItem } = useSecureStorage()
  const { handleErrorMessage } = useMessageHandler()
  const { login } = useAuthLocal()
  const navigation = useNavigation<any>()

  const formik = useLoginFormik(async values => {
    try {
      setIsLoading(true)
      const data = {
        ...values,
        channel: Config.CHANNEL_APP,
        tenant: '',
        country: ''
      }
      const resp = await post<AuthResponse>(API_CONFIG.Auth.login, data)
      setItem(KEYS_MMKV.ACCESS_TOKEN, resp.data.access_token)
      setItem(KEYS_MMKV.REFRESH_TOKEN, resp.data.refresh_token)
      await login(resp?.data?.access_token)
    } catch (err) {
      handleErrorMessage(err as AxiosError)
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
        {i18n.t('welcome')}
      </Text>
      <View style={styles.formikContainer}>
        <FormInput
          field="username"
          label={i18n.t('user')}
          placeholder={i18n.t('username')}
          formik={formik}
        />
        <FormInput
          field="password"
          label={i18n.t('password')}
          formik={formik}
          rightIcon
          secureTextEntry
          placeholder={i18n.t('password')}
        />
        <View style={styles.btnResetPassContainer}>
          <TouchableOpacity
            style={styles.btnResetPass}
            onPress={() => navigation.navigate('ResetPass')}>
            <Text style={styles.textBtnResetPass}>{i18n.t('resetPass')}</Text>
          </TouchableOpacity>
        </View>
        <FormButton
          title={i18n.t('ingress', { modifier: 'capitalize' })}
          isLoading={isLoading}
          onPress={formik.handleSubmit}
        />
        <Text style={styles.version}>{Config.VERSION_NAME}</Text>
      </View>
    </ScrollView>
  )
}

// Definición de los tipos de valores del formulario
interface LoginValues {
  username: string
  password: string
}

// Validación con Yup
const getLoginSchema = () => {
  return Yup.object().shape({
    username: Yup.string()
      .min(2, i18n.t('minLengthString', { values: { minLength: 2 } }))
      .max(50, i18n.t('maxLengthString', { values: { maxLength: 50 } }))
      .required(i18n.t('required')),
    password: Yup.string()
      .min(6, i18n.t('minLengthString', { values: { minLength: 8 } }))
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
      username: '', // 'agro_app_braud',
      password: '' // 'Nueva123'
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
}

// Componente de Botón
const FormButton: React.FC<FormButtonProps> = ({
  title,
  isLoading,
  onPress
}) => {
  return (
    <Button
      title={title}
      loading={isLoading}
      onPress={onPress}
      loadingProps={{ size: 'small', color: COLORS.white }}
      titleStyle={styles.buttonTitle}
      buttonStyle={styles.buttonStyle}
      containerStyle={styles.buttonContainer}
    />
  )
}

// Estilos
const styles = StyleSheet.create({
  title: {
    marginTop: SPACING.xLarge,
    textAlign: 'center',
    color: COLORS.primary
  },
  container: {
    flex: 1,
    alignContent: 'center',
    backgroundColor: COLORS.background
  },
  logoContainer: {
    marginTop: width * 0.2,
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
