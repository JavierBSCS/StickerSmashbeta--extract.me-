import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import React, { useState } from "react";
import CustomView from "@/components/themed/CustomView";
import Entypo from "@expo/vector-icons/Entypo";
import { Link, router } from "expo-router";
import { supabase } from "@/database/supabase";
import { login_validator } from "@/utils/CustomValidator";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";
import * as SecureStore from "expo-secure-store";

export default function Login() {
  interface User {
    email: string;
    password: string;
  }

  const [errName, setErrName] = useState<User>({ email: "", password: "" });
  const [user, setUser] = useState<User>({ email: "", password: "" });
  const [disable, setDisable] = useState<boolean>(false);
  const [seen, setSeen] = useState<boolean>(false); // State for password visibility

  const handleChange = (value: string, key: keyof User) => {
    setUser({ ...user, [key]: value });
  };

  const login = async () => {
    setErrName({ email: "", password: "" });
    const { status, err } = login_validator(user);

    if (status) {
      setErrName(err);
      setDisable(false);
    } else {
      try {
        setDisable(true);
        const { data } = await supabase.rpc("email_exists", {
          email_to_check: user.email,
        });

        if (data[0].email_exists == false) {
          setErrName((prev) => ({
            ...prev,
            email: "email doesn't exists",
          }));
          setDisable(false);
          return;
        }

        if (data[0].user_password !== user.password) {
          setErrName((prev) => ({
            ...prev,
            password: "incorrect password",
          }));
          setDisable(false);
          return;
        }

        
          await AsyncStorage.setItem("user", data[0].user_id);
        

        setUser({ email: "", password: "" });
        setDisable(false);
        router.push("/(tabs)");
      } catch (error) {
        console.log(error);
      }
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
          <Text style={{ fontFamily: "RobotoM", fontSize: 30 }}>Welcome back</Text>
          <Text style={{ fontFamily: "Poppins" }}>Enter credentials to login</Text>
        </View>

        <View style={{ flexDirection: "column", gap: 8 }}>
          <View style={styles.input_group}>
            <Entypo style={styles.input_icon} name="email" size={24} color="black" />
            <TextInput
              style={styles.input}
              placeholder="email"
              onChangeText={(value) => handleChange(value, "email")}
            />
            {errName.email && <Text style={styles.err_style}>{errName.email}</Text>}
          </View>

          <View style={styles.input_group}>
            <Entypo style={styles.input_icon} name="lock" size={24} color="black" />
            <TextInput
              style={styles.input}
              placeholder="Password"
              value={user.password}
              onChangeText={(value) => handleChange(value, "password")}
              secureTextEntry={!seen} // Conditionally hide the password
            />
            <Pressable
              style={{ position: "absolute", right: 10 }}
              onPress={() => setSeen(!seen)} // Toggle visibility
            >
              <Entypo name={seen ? "eye" : "eye-with-line"} size={20} color="black" />
            </Pressable>
            {errName.password && <Text style={styles.err_style}>{errName.password}</Text>}
          </View>

          <Pressable
            onPress={() => login()}
            style={styles.form_btn}
            android_ripple={{ color: "rgba(0, 0, 0, 0.1)", borderless: false }}
          >
            <Text style={styles.form_btn_text}>Login</Text>
          </Pressable>

          <Link href="/Passwordreset" style={{ padding: 10 }}>
            <Text style={{ color: "#e68a00" }}>Forgot Password?</Text>
          </Link>

          <View style={{ flexDirection: "row", gap: 10, padding: 10 }}>
            <Text style={{ fontFamily: "Poppins" }}>Don't have an Account?</Text>
            <Link href="/Signup">
              <Text style={{ color: "#e68a00", fontFamily: "Poppins" }}>Sign up</Text>
            </Link>
          </View>
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
