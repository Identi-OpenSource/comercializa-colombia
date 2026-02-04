import { Button, Dialog, Text } from '@rneui/themed'
import React from 'react'
import { DIALOG_STYLES } from '../theme/mccTheme'
import { View } from 'react-native'

interface DialogProps {
  visible: boolean
  title: string
  message: string
  type?: string
  onClose: () => void
}

const DialogComponent: React.FC<DialogProps> = ({
  type,
  visible,
  title,
  message,
  onClose
}) => {
  return (
    <Dialog
      isVisible={visible}
      onBackdropPress={onClose}
      backdropStyle={[DIALOG_STYLES.backdropStyle]}
      overlayStyle={[DIALOG_STYLES.dialog, type && DIALOG_STYLES.dialogError]}>
      <Dialog.Title title={title} titleStyle={DIALOG_STYLES.title} />
      <Text style={DIALOG_STYLES.message}>{message}</Text>
      <Dialog.Actions>
        <View style={DIALOG_STYLES.actionStyle}>
          <Button
            title="Aceptar"
            onPress={onClose}
            buttonStyle={DIALOG_STYLES.buttonStylePrimary}
          />
        </View>
      </Dialog.Actions>
    </Dialog>
  )
}

export default DialogComponent
