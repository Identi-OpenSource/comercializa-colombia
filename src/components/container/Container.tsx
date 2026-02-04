import { Icon, Text } from '@rneui/themed'
import React from 'react'
import { StyleSheet, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { COLORS, SPACING } from '../../contexts/theme/defaultTheme'
import i18n from '../../contexts/i18n/i18n'
import useNetInfo from '../../hooks/useNetInfo'
import { FONTS } from '../../contexts/theme/mccTheme'

export const Container = ({
  children,
  showConnection = false
}: {
  children: React.ReactNode
  showConnection?: boolean
}) => {
  const connectionStatus = useNetInfo()
  const insets = useSafeAreaInsets()
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: 'white',
      paddingTop: insets.top,
      paddingHorizontal: 0,
      paddingBottom: insets.bottom
    },
    connection: {
      paddingVertical: SPACING.xSmall,
      height: 50,
      width: '100%'
    },
    connectionChild: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: SPACING.small,
      borderTopWidth: 0.5,
      borderBottomWidth: 0.5,
      paddingVertical: SPACING.xSmall,
      borderColor: COLORS.grayOpacity
    },
    textNoConnection: {
      fontSize: 14,
      color: COLORS.inputText
    },
    icon: {
      fontSize: 20,
      marginRight: SPACING.xSmall
    },
    version: {
      fontFamily: FONTS.regular,
      textAlign: 'center',
      color: COLORS.grayOpacity,
      fontSize: 12,
      marginVertical: SPACING.large
    }
  })

  return (
    <View style={styles.container}>
      {showConnection && (
        <View style={styles.connection}>
          {!connectionStatus && (
            <View style={styles.connectionChild}>
              <Icon
                name="wifi-off"
                type="material"
                style={styles.icon}
                color={COLORS.inputText}
              />
              <Text style={styles.textNoConnection}>
                {i18n.t('noConnection')}
              </Text>
            </View>
          )}
        </View>
      )}
      {children}
    </View>
  )
}
