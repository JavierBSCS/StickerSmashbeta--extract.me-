import { StyleSheet, Text, View, Image } from 'react-native'
import React from 'react'
import CustomView from '@/components/themed/CustomView'

export default function EditProfile() {
  return (
    <View>
      <View>
        <Image source={require('@/assets/category/meat.jpg')} style={{ width: 40, height: 40 }}/>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({})