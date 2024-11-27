import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  TextInput,
  Button,
  Pressable,
} from "react-native";
import React, { useEffect, useState } from "react";
import { supabase } from "@/database/supabase";
import AntDesign from "@expo/vector-icons/AntDesign";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function search() {
  const [inputs, setInputs] = useState<string[]>([]);
  const [curr, setCurr] = useState<string>("");

  const handleAddInput = () => {
    if(curr === '') return;
    setInputs((prev) => [...prev, curr]);
    setCurr("");
  };

  const handleRemoveInput = (index: number) => {
    setInputs((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <View
      style={{ padding: 20, paddingTop: 50, flexDirection: "column", gap: 10 }}
    >
      {inputs &&
        inputs.map((input, index) => (
          <View
            key={index}
            style={{ flexDirection: "row", alignItems: "center" }}
          >
            <View style={{ borderWidth: 0.4, borderColor: '#ccc', flex: 1, borderRadius: 5 }}>
              <Text style={{ fontFamily: "Poppins", fontSize: 15, padding: 10 }}>
                {input}
              </Text>
            </View>
            <Pressable onPress={() => handleRemoveInput(index)}>
              <AntDesign name="close" size={24} color="black" />
            </Pressable>
          </View>
        ))}
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <TextInput
          placeholder="ingredients"
          style={{ borderWidth: 0.4, padding: 5, borderRadius: 5, flex: 1 }}
          value={curr}
          onChangeText={setCurr}
        />
        <Pressable onPress={handleAddInput}>
          <Ionicons name="add-circle" size={24} color="black" />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({});
