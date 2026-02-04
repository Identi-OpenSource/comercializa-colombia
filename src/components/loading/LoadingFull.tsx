import { Text } from '@rneui/base'
import React from 'react'
import { StyleSheet, View } from 'react-native'

export const LoadingStore = () => {
  return (
    <View style={styles.container}>
      <Text>Loading...</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
})
