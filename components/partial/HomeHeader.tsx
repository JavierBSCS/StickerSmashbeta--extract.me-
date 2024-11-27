import { StyleSheet, View, StyleProp, ViewStyle, Text, TextStyle } from 'react-native';
import React from 'react';
import { MaterialIcons } from '@expo/vector-icons';

interface HomeHeaderProps {
  title: string;
  style?: StyleProp<ViewStyle>;
}

const HomeHeader: React.FC<HomeHeaderProps> = ({ title, style }) => {
  return (
    <View style={[styles.default, style]}>
      <MaterialIcons name="grid-3x3" size={24} color="#fff" />
      <Text style={styles.title}>{title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  default: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(230, 138, 0, 0.9)",
    paddingLeft: 10,
    elevation: 10
  },
  title: {
    padding: 8,
    fontSize: 20,
    fontFamily: "Courgette",
    color: "#000",
  },
});

export default HomeHeader;
