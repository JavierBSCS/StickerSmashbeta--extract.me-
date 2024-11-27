import { StyleSheet, Text, View, TextInput, Pressable } from "react-native";
import React, { useState } from "react";
import CustomView from "@/components/themed/CustomView";
import Feather from "@expo/vector-icons/Feather";
import Entypo from "@expo/vector-icons/Entypo";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { Link, router } from "expo-router";
import { signup_validator } from "@/utils/CustomValidator";
import { supabase } from "@/database/supabase";
import { genID } from "@/components/utils/genID";

export default function Signup() {
  // Fix the interface declaration
  type User = {
    f_name: string;
    l_name: string;
    email: string;
    phone: string;
    password: string;
    confirmPassword: string;
  };

  // Update state types to match the User type
  const [errName, setErrName] = useState<Partial<User>>({
    f_name: "",
    l_name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "", // Make sure to handle this as well
  });
  

  const [user, setUser] = useState<User>({
    f_name: "",
    l_name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [disable, setDisable] = useState<boolean>(false);
  const [seenPassword, setSeenPassword] = useState<boolean>(false);
  const [seenConfirmPassword, setSeenConfirmPassword] = useState<boolean>(false);

  const handleChange = (value: string, key: keyof User) => {
    setUser({ ...user, [key]: value });
  };

  const register = async () => {
    // Validate the passwords before proceeding
    if (user.password !== user.confirmPassword) {
      setErrName({
        ...errName,
        confirmPassword: "Passwords do not match",
      });
      return;
    }
  
    const { status, err } = signup_validator(user);
    if (status) {
      setErrName(err);
      setDisable(false);
      console.log(err);
    } else {
      setDisable(true);
      try {
        const { error } = await supabase.from("user").insert({
          user_id: genID("user"),
          f_name: user.f_name,
          l_name: user.l_name,
          email: user.email,
          phone: user.phone,
          password: user.password,
        });
        
        if (error) {
          console.log(error.details);
  
          // Check if the error is related to email already existing
          if (error.details.includes("email")) {
            setErrName((prev) => ({
              ...prev,
              email: "Email already exists",
            }));
          } else {
            setErrName((prev) => ({
              ...prev,
              email: error.details, // Default error message for email field
            }));
          }
  
          setDisable(false);
          return;
        }
  
        setDisable(false);
        setUser({
          f_name: "",
          l_name: "",
          email: "",
          phone: "",
          password: "",
          confirmPassword: "",
        });
        setErrName({
          f_name: "",
          l_name: "",
          email: "",
          phone: "",
          password: "",
          confirmPassword: "",
        });
  
        router.navigate("/Login");
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
          <Text style={{ fontFamily: "RobotoM", fontSize: 30 }}>Sign up</Text>
          <Text style={{ fontFamily: "Poppins" }}>Create your account</Text>
        </View>

        <View style={{ flexDirection: "column", gap: 20 }}>
          {/* Form fields */}
          <View style={styles.input_group}>
            <Entypo style={styles.input_icon} name="email" size={24} color="black" />
            <TextInput
              style={styles.input}
              placeholder="email"
              value={user.email}
              onChangeText={(value) => handleChange(value, "email")}
            />
            {errName.email && <Text style={styles.err_style}>{errName.email}</Text>} {/* Error display */}
          </View>


          <View style={styles.input_group}>
            <Feather style={styles.input_icon} name="phone" size={24} color="black" />
            <TextInput
              style={styles.input}
              placeholder="phone"
              value={user.phone}
              keyboardType="numeric"
              onChangeText={(value) => handleChange(value, "phone")}
            />
            {errName.phone && <Text style={styles.err_style}>{errName.phone}</Text>}
          </View>

          <View style={styles.input_group}>
            <FontAwesome5 style={styles.input_icon} name="user" size={24} color="black" />
            <TextInput
              style={styles.input}
              placeholder="First Name"
              value={user.f_name}
              onChangeText={(value) => handleChange(value, "f_name")}
            />
            {errName.f_name && <Text style={styles.err_style}>{errName.f_name}</Text>}
          </View>

          <View style={styles.input_group}>
            <FontAwesome5 style={styles.input_icon} name="user" size={24} color="black" />
            <TextInput
              style={styles.input}
              placeholder="Last Name"
              value={user.l_name}
              onChangeText={(value) => handleChange(value, "l_name")}
            />
            {errName.l_name && <Text style={styles.err_style}>{errName.l_name}</Text>}
          </View>

          {/* Password fields */}
          <View style={styles.input_group}>
            <Entypo style={styles.input_icon} name="lock" size={24} color="black" />
            <TextInput
              style={styles.input}
              placeholder="Password"
              value={user.password}
              onChangeText={(value) => handleChange(value, "password")}
              secureTextEntry={!seenPassword}
            />
            <Pressable
              style={{ position: "absolute", right: 10 }}
              onPress={() => setSeenPassword(!seenPassword)}
            >
              <Feather name={seenPassword ? "eye-off" : "eye"} size={20} color="black" />
            </Pressable>
            {errName.password && <Text style={styles.err_style}>{errName.password}</Text>}
          </View>

          <View style={styles.input_group}>
            <Entypo style={styles.input_icon} name="lock" size={24} color="black" />
            <TextInput
              style={styles.input}
              placeholder="Confirm Password"
              value={user.confirmPassword}
              onChangeText={(value) => handleChange(value, "confirmPassword")}
              secureTextEntry={!seenConfirmPassword}
            />
            <Pressable
              style={{ position: "absolute", right: 10 }}
              onPress={() => setSeenConfirmPassword(!seenConfirmPassword)}
            >
              <Feather name={seenConfirmPassword ? "eye-off" : "eye"} size={20} color="black" />
            </Pressable>
            {errName.confirmPassword && (
              <Text style={styles.err_style}>{errName.confirmPassword}</Text>
            )}
          </View>

          <Pressable
            onPress={() => register()}
            style={styles.form_btn}
            android_ripple={{
              color: "rgba(0, 0, 0, 0.1)",
              borderless: false,
            }}
          >
            <Text style={styles.form_btn_text}>Sign up</Text>
          </Pressable>

          <View style={{ flexDirection: "row", gap: 10, padding: 10 }}>
            <Text style={{ fontFamily: "Poppins" }}>Already have an Account?</Text>
            <Link href="/Login">
              <Text style={{ color: "#e68a00", fontFamily: "Poppins" }}>Login</Text>
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
    position: "relative",
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
    borderWidth: 1,
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
