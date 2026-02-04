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
import { useNavigation, useRoute } from '@react-navigation/native'

// Constantes
const { width } = Dimensions.get('window')
const LOGO = require('../../../assets/img/logo.png')

export const ChangeResetPassScreen: React.FC = () => {
  const [isLoading, setIsLoading] = React.useState(false)
  const { patch } = useCustomHttpRequest()
  const { handleMessage } = useMessageHandler()
  const navigation = useNavigation<any>()
  const route = useRoute<any>()
  const params = route.params

  const formik = useLoginFormik(
    { username: params?.username ?? '' },
    async values => {
      try {
        setIsLoading(true)
        const data = {
          username: values.username,
          hash: values.hash,
          password: values.password
        }
        await patch<AuthResponse>(API_CONFIG.Auth.resetPassword, data)
        navigation.navigate('Home')
        handleMessage('success', 'resetPasswordSuccess')
      } catch (err) {
        const error = err as AxiosError
        console.log('error', error)
        handleMessage('error', 'resetPasswordError')
      } finally {
        setIsLoading(false)
      }
    }
  )

  return (
    <ScrollView style={[styles.container]} keyboardShouldPersistTaps="handled">
      <View style={styles.logoContainer}>
        <Image source={LOGO} style={styles.logo} />
      </View>
      <Text h4 style={styles.title}>
        {i18n.t('changePassSend')}
      </Text>
      <View style={styles.formikContainer}>
        <FormInput
          field="username"
          label={i18n.t('username', { modifier: 'capitalize' })}
          placeholder={i18n.t('username')}
          formik={formik}
        />
        <FormInput
          field="hash"
          label={i18n.t('hash', { modifier: 'capitalize' })}
          placeholder={i18n.t('hash')}
          formik={formik}
        />
        <FormInput
          field="password"
          label={i18n.t('password', { modifier: 'capitalize' })}
          formik={formik}
          secureTextEntry
          placeholder={i18n.t('password')}
          rightIcon
        />
        <FormInput
          field="repassword"
          label={i18n.t('repassword', { modifier: 'capitalize' })}
          formik={formik}
          secureTextEntry
          placeholder={i18n.t('repassword')}
          rightIcon
        />
        <FormButton
          title={i18n.t('ingress', { modifier: 'capitalize' })}
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
  hash: string
  password: string
  repassword: string
}

// Validación con Yup
const getLoginSchema = () => {
  return Yup.object().shape({
    username: Yup.string()
      .min(2, i18n.t('minLengthString', { values: { minLength: 2 } }))
      .max(50, i18n.t('maxLengthString', { values: { maxLength: 50 } }))
      .required(i18n.t('required')),
    hash: Yup.string()
      .min(2, i18n.t('minLengthString', { values: { minLength: 2 } }))
      .max(20, i18n.t('maxLengthString', { values: { maxLength: 20 } }))
      .required(i18n.t('required')),
    password: Yup.string()
      .min(6, i18n.t('minLengthString', { values: { minLength: 8 } }))
      .required(i18n.t('required')),
    repassword: Yup.string()
      .oneOf([Yup.ref('password')], i18n.t('passwordNotMatch'))
      .required(i18n.t('required'))
  })
}

// Función para crear el hook formik con tipado
const useLoginFormik = (
  init: any,
  onSubmit: (
    values: LoginValues,
    formikHelpers: FormikHelpers<LoginValues>
  ) => void
) => {
  return useFormik<LoginValues>({
    initialValues: {
      username: init?.username,
      password: '',
      repassword: '',
      hash: ''
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
