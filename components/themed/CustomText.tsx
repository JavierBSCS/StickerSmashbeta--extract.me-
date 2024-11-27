import { StyleSheet, Text, View, StyleProp, TextStyle } from 'react-native';
import React from 'react';

interface CustomTextProps {
  children: React.ReactNode;
  style?: StyleProp<TextStyle>;
}

const CustomText: React.FC<CustomTextProps> = ({ children, style }) => {
  return (
    <Text style={[styles.default, style]}>{children}</Text>
  );
};

const styles = StyleSheet.create({
  default: {
    fontSize: 16,
    color: 'black',
  },
});

export default CustomText;
