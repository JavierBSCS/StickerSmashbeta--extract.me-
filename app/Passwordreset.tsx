import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import React, { useState } from "react";
import CustomView from "@/components/themed/CustomView";
import Entypo from "@expo/vector-icons/Entypo";
import { router } from "expo-router";
import Feather from "@expo/vector-icons/Feather";
import * as SMS from "expo-sms";

export default function Passwordreset() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isValidPhone, setIsValidPhone] = useState(true); // State to track phone validation

  const handlePhoneNumberChange = (value: string) => {
    setPhoneNumber(value);

    // Log the value to debug
    console.log(value);

    // Improved validation for phone number (can be more complex depending on your region)
    const phoneRegex = /^[0-9\s\-\+\(\)]{10,15}$/; // Allow spaces, dashes, parentheses, and between 10 to 15 digits
    setIsValidPhone(phoneRegex.test(value));
  };

  const handleReset = async () => {
    // Check if the phone number is valid
    if (!isValidPhone) {
      alert("Please enter a valid phone number.");
      return;
    }

    // Example SMS function (you can customize this logic as needed)
    const { result } = await SMS.sendSMSAsync(
      [phoneNumber],
      "Your password reset code is: 123456" // Replace with actual reset logic
    );
    if (result === "sent") {
      alert("Reset code sent to your phone!");
      router.push("/(tabs)"); // Redirect after reset
    } else {
      alert("Failed to send reset code.");
    }
  };

  return (
    <CustomView style={{ flex: 1, backgroundColor: "#f2f2f2" }}>
      <Pressable
        style={{ position: "absolute", top: 35, left: 10 }}
        onPress={() => router.back()}
      >
        <Entypo name="chevron-left" size={35} color="rgba(230, 138, 0, 0.9)" />
      </Pressable>
      <View style={styles.inner}>
        <View style={{ flexDirection: "column", alignItems: "center", gap: 10 }}>
          <Text style={{ fontFamily: "RobotoM", fontSize: 30 }}>Password Reset</Text>
          <Text style={{ fontFamily: "Poppins" }}>Enter phone number</Text>
        </View>

        <View style={{ flexDirection: "column", gap: 8 }}>
          <View style={styles.input_group}>
            <Feather style={styles.input_icon} name="phone" size={24} color="black" />
            <TextInput
              style={styles.input}
              placeholder="Phone"
              value={phoneNumber}
              onChangeText={handlePhoneNumberChange}
              keyboardType="phone-pad"
            />
            {!isValidPhone && phoneNumber && (
              <Text style={styles.err_style}>Invalid phone number</Text>
            )}
          </View>

          <Pressable
            style={styles.form_btn}
            android_ripple={{
              color: "rgba(0, 0, 0, 0.1)",
              borderless: false,
            }}
            onPress={handleReset} // Call reset logic on button press
          >
            <Text style={styles.form_btn_text}>Reset</Text>
          </Pressable>
        </View>
      </View>
    </CustomView>
  );
}

const styles = StyleSheet.create({
  inner: {
    flex: 1,
    padding: 30,
    justifyContent: "center",
    alignItems: "center",
    gap: 30,
  },
  input_group: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  input_icon: {
    position: "absolute",
    left: 8,
    zIndex: 1,
    color: "#333",
  },
  input: {
    backgroundColor: "rgba(230, 138, 0, 0.1)",
    width: "100%",
    padding: 10,
    paddingLeft: 40,
    borderRadius: 20,
    fontFamily: "Poppins",
  },
  form_btn: {
    backgroundColor: "rgba(230, 138, 0, 0.9)",
    padding: 10,
    borderRadius: 20,
  },
  form_btn_text: {
    fontFamily: "Poppins",
    textAlign: "center",
    fontSize: 20,
    color: "#fff",
  },
  err_style: {
    position: "absolute",
    backgroundColor: "#fff",
    right: 10,
    top: -10,
    color: "red",
    fontFamily: "Poppins",
    paddingLeft: 5,
    paddingRight: 5,
    borderRadius: 5,
    elevation: 1,
  },
});
