import React, { createContext, useState, ReactNode } from 'react'
import DialogComponent from './Dialog'

interface DialogProps {
  type?: string
  title: string
  message: string
  onClose?: () => void | null
}

interface DialogContextProps {
  showDialog: (props: DialogProps) => void
  hideDialog: () => void
}

const DialogContext = createContext<DialogContextProps | null>(null)

interface DialogProviderProps {
  children: ReactNode
}

const DialogProvider: React.FC<DialogProviderProps> = ({ children }) => {
  const [visible, setVisible] = useState(false)
  const [titleDialog, setTitleDialog] = useState('')
  const [messageDialog, setMessageDialog] = useState('')
  const [typeDialog, setTypeDialog] = useState('')
  const [onCloseDialog, setOnCloseDialog] = useState<(() => void) | null>(null)

  const showDialog = ({ type, title, message, onClose }: DialogProps) => {
    setVisible(true)
    setTitleDialog(title)
    setTypeDialog(type || '')
    setMessageDialog(message)
    setOnCloseDialog(() => onClose || hideDialog)
  }

  const hideDialog = () => {
    setVisible(false)
    if (onCloseDialog) {
      onCloseDialog()
    }
  }

  return (
    <DialogContext.Provider value={{ showDialog, hideDialog }}>
      {children}
      <DialogComponent
        type={typeDialog}
        visible={visible}
        title={titleDialog}
        message={messageDialog}
        onClose={hideDialog}
      />
    </DialogContext.Provider>
  )
}

export { DialogProvider, DialogContext }
