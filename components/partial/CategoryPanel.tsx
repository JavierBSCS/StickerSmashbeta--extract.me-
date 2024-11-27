import {
  StyleSheet,
  View,
  StyleProp,
  ViewStyle,
  Text,
  Image,
  Pressable,
} from "react-native";
import React from "react";
import { router, useLocalSearchParams } from "expo-router";

interface CategoryPanelProps {
  title: string;
  category: string;
  imageSource: any;
  style?: StyleProp<ViewStyle>;
}

const CategoryPanel: React.FC<CategoryPanelProps> = ({
  title,
  category,
  imageSource,
  style,
}) => {

  return (
    <Pressable
      onPress={()=> router.navigate({pathname: '/Category', params: {category}})}
      android_ripple={{ color: "rgba(0, 0, 0, 0.1)" }}
      style={[styles.default, style]}
    >
      <Image source={imageSource} style={styles.image} />
      <Text style={styles.title}>{title}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  default: {
    position: "relative",
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 2,
    elevation: 10,
  },
  image: {
    width: 130,
    height: 130,
    borderRadius: 10,
  },
  title: {
    alignSelf: "center",
    position: "absolute",
    bottom: -1,
    width: "90%",
    elevation: 1,
    height: 30,
    backgroundColor: "rgba(230, 138, 0, 0.9)",
    textAlign: "center",
    verticalAlign: "middle",
    color: "#fff",
    fontSize: 20,
    borderRadius: 5,
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    fontFamily: "RobotoM",
  },
});

export default CategoryPanel;
