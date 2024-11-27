import { StyleSheet, View, StyleProp, ViewStyle } from 'react-native';
import React from 'react';

interface CustomContainerProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

const CustomContainer: React.FC<CustomContainerProps> = ({ children, style }) => {
  return (
    <View style={[styles.default, style]}>{children}</View>
  );
};

const styles = StyleSheet.create({
  default: {
    flex: 1,
    backgroundColor: '#f0f0f0', 
    paddingTop: 35,
    padding: 20, 
  },
});

export default CustomContainer;
