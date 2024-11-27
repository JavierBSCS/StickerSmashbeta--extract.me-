import { StyleSheet, View, StyleProp, ViewStyle } from 'react-native';
import React from 'react';
import StatusBarGradient from '../utils/StatusBarGradient';

interface CustomViewProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

const CustomView: React.FC<CustomViewProps> = ({ children, style }) => {
  return (
    <View style={[styles.default, style]}>
        <StatusBarGradient/>
        {children}
    </View>
  );
};

const styles = StyleSheet.create({
  default: {
    backgroundColor: 'white',
  },
});

export default CustomView;
