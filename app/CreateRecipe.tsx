import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import React, { useState } from "react";
import CustomView from "@/components/themed/CustomView";
import ImageUpload from "@/components/partial/ImageUpload";
import { Picker } from "@react-native-picker/picker";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import AntDesign from "@expo/vector-icons/AntDesign";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import Feather from "@expo/vector-icons/Feather";
import Entypo from "@expo/vector-icons/Entypo";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { create_validator } from "@/utils/CustomValidator";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

import { supabase } from "@/database/supabase";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { Ionicons } from "@expo/vector-icons";

interface Other {
  cook: string;
  prep: string;
  level: string;
  total: string;
  yield: string;
}

interface Content {
  nutritions: string[];
  ingredients: string[];
  directions: string[];
}

interface CreateError {
  title: string;
  category: string;
  cook: string;
  prep: string;
  level: string;
  total: string;
  yield: string;
}

interface RecipeContent {
  other: Other;
  nutritions: string[];
  ingredients: string[];
  directions: string[];
}

export default function CreateRecipe() {
  const { user } = useCurrentUser();
  const [selectedCategory, setSelectedCategory] = useState("meat");
  const [title, setTitle] = useState<string>("");

  const category_options = [
    { label: "meat", value: "meat" },
    { label: "vegan", value: "vegan" },
    { label: "dessert", value: "dessert" },
    { label: "beverage", value: "beverage" },
  ];

  const level_options = ["begginer", "intermidiate", "advance"];

  const [extra, setExtra] = useState<Other>({
    cook: "",
    prep: "",
    level: "",
    total: "",
    yield: "",
  });

  const [content, setContent] = useState<Content>({
    nutritions: [],
    ingredients: [],
    directions: [],
  });

  const [currN, setCurrN] = useState<string>("");
  const [currI, setCurrI] = useState<string>("");
  const [currD, setCurrD] = useState<string>("");

  const [nutritions, setNutritions] = useState<string[]>([]);
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [directions, setDirections] = useState<string[]>([]);

  const handleAddInput = (current: string) => {
    if (current === "nutri" && currN != '') {
      setNutritions((prev) => [...prev, currN]);
      setCurrN("");
    }
    if (current === "ingr" && currI != '') {
      setIngredients((prev) => [...prev, currI]);
      setCurrI("");
    }
    if (current === "dire" && currD != '') {
      setNutritions((prev) => [...prev, currD]);
      setCurrD("");
    }
  };

  const handleRemoveInput = (index: number, current: string) => {
    if(current === 'nutri'){
      setNutritions((prev) => prev.filter((_, i) => i !== index));
    }
    if(current === 'ingr'){
      setIngredients((prev) => prev.filter((_, i) => i !== index));
    }
    if(current === 'dire'){
      setDirections((prev) => prev.filter((_, i) => i !== index));
    }
    
  };

  const [recipeID, setRecipeID] = useState<string | null>(null);
  const [createError, setCreateError] = useState<CreateError | null>(null);

  const handleChangeExtra = (value: string, key: keyof Other) => {
    setExtra({ ...extra, [key]: value });
  };

  // const handleChangeContent = (value: string, key: keyof Content) => {
  //   const toArray: string[] = [];
  //   const split = value.split(/,\s+/);
  //   split.forEach((word) => {
  //     toArray.push(word.trim());
  //   });

  //   setContent({ ...content, [key]: toArray });
  // };

  const handleSubmit = async () => {
    const { status, create_error } = create_validator(
      title,
      selectedCategory,
      extra,
    );
    console.log(status);
    if (status) {
      setCreateError(create_error);
      console.log(createError);
    } else {
      setCreateError(null);
      const recipe_insert: RecipeContent = {
        other: extra,
        nutritions,
        ingredients ,
        directions,
      };
      try {
        const { data, error } = await supabase
          .from("recipe")
          .insert({
            title,
            author: user?.user_id,
            content: JSON.stringify(recipe_insert),
            category: selectedCategory,
          })
          .select("recipe_id");
        if (error) {
          console.log("bad: ", error);
        } else {
          console.log("good: ", data);
          setRecipeID(data[0].recipe_id);
        }
      } catch (err) {
        console.log("error insert: ", err);
      }
    }
  };

  return (
    <CustomView>
      <ScrollView style={{ height: "100%" }}>
        <View
          style={{
            padding: 20,
            height: "100%",
            paddingTop: 50,
            flexDirection: "column",
            gap: 20,
          }}
        >
          <View>
            <Text
              style={{
                fontFamily: "Aclonica",
                fontSize: 30,
                textAlign: "center",
              }}
            >
              CREATE RECIPE
            </Text>
            <Text style={{ textAlign: "center", fontFamily: "Poppins" }}>
              post your own recipes for others to taste
            </Text>
          </View>
          <View style={{ flexDirection: "column", gap: 10 }}>
            <ImageUpload recipe_id={recipeID} />
            <View style={{ flexDirection: "column", gap: 10 }}>
              <View style={styles.input_group}>
                <FontAwesome
                  name="pencil-square-o"
                  size={24}
                  color="black"
                  style={styles.input_icon}
                />
                <TextInput
                  placeholder="Title"
                  style={[
                    styles.txt_input,
                    createError?.title ? styles.err_border : styles.bl_err,
                  ]}
                  onChangeText={setTitle}
                />
                {createError?.title && (
                  <Text style={styles.err_panel}>{createError.title}</Text>
                )}
              </View>
              <View
                style={{ flexDirection: "row", alignItems: "center", gap: 15 }}
              >
                <MaterialCommunityIcons
                  name="food-steak"
                  size={24}
                  color="black"
                />
                <Text style={{ fontFamily: "Poppins" }}>Categories</Text>
              </View>
              <View style={{ flexDirection: "row", gap: 10 }}>
                <Picker
                  style={[styles.txt_picker, { flexGrow: 1 }]}
                  selectedValue={selectedCategory}
                  onValueChange={(itemValue: string) =>
                    setSelectedCategory(itemValue)
                  }
                >
                  {category_options.map((option) => (
                    <Picker.Item
                      key={option.value}
                      label={option.label}
                      value={option.value}
                    />
                  ))}
                </Picker>
                <Picker
                  style={[styles.txt_picker, { flexGrow: 1 }]}
                  selectedValue={extra.level}
                  onValueChange={(itemValue: string) =>
                    handleChangeExtra(itemValue, "level")
                  }
                >
                  {level_options.map((option: string) => (
                    <Picker.Item key={option} label={option} value={option} />
                  ))}
                </Picker>
              </View>
              <View style={styles.input_group}>
                <AntDesign
                  name="clockcircleo"
                  size={24}
                  color="black"
                  style={styles.input_icon}
                />
                <TextInput
                  placeholder="Cook Time"
                  style={[
                    styles.txt_input,
                    createError?.cook ? styles.err_border : styles.bl_err,
                  ]}
                  onChangeText={(itemValue: string) =>
                    handleChangeExtra(itemValue, "cook")
                  }
                />
                {createError?.cook && (
                  <Text style={styles.err_panel}>{createError?.cook}</Text>
                )}
              </View>
              <View style={styles.input_group}>
                <AntDesign
                  name="clockcircleo"
                  size={24}
                  color="black"
                  style={styles.input_icon}
                />
                <TextInput
                  placeholder="Preparation Time"
                  style={[
                    styles.txt_input,
                    createError?.prep ? styles.err_border : styles.bl_err,
                  ]}
                  onChangeText={(itemValue: string) =>
                    handleChangeExtra(itemValue, "prep")
                  }
                />
                {createError?.prep && (
                  <Text style={styles.err_panel}>{createError.prep}</Text>
                )}
              </View>

              <View style={styles.input_group}>
                <AntDesign
                  name="clockcircleo"
                  size={24}
                  color="black"
                  style={styles.input_icon}
                />
                <TextInput
                  placeholder="Total Time"
                  style={[
                    styles.txt_input,
                    createError?.total ? styles.err_border : styles.bl_err,
                  ]}
                  onChangeText={(itemValue: string) =>
                    handleChangeExtra(itemValue, "total")
                  }
                />
                {createError?.total && (
                  <Text style={styles.err_panel}>{createError.total}</Text>
                )}
              </View>
              <View style={styles.input_group}>
                <FontAwesome6
                  name="people-group"
                  size={24}
                  color="black"
                  style={styles.input_icon}
                />
                <TextInput
                  placeholder="Serving Size"
                  style={[
                    styles.txt_input,
                    createError?.yield ? styles.err_border : styles.bl_err,
                  ]}
                  onChangeText={(itemValue: string) =>
                    handleChangeExtra(itemValue, "yield")
                  }
                />
                {createError?.yield && (
                  <Text style={styles.err_panel}>{createError.yield}</Text>
                )}
              </View>
              <View
                style={{ flexDirection: "row", alignItems: "center", gap: 15 }}
              >
                <MaterialIcons
                  name="health-and-safety"
                  size={24}
                  color="black"
                  style={{ paddingLeft: 5 }}
                />
                <Text style={{ fontFamily: "Poppins" }}>Nutritions</Text>
              </View>
              {/* <View style={{ position: "relative" }}>
                {createError?.nutritions && (
                  <Text style={styles.err_panel}>{createError.nutritions}</Text>
                )}
                <TextInput
                  placeholder="use a comma and 2 space for input format"
                  style={[
                    styles.txt_multi,
                    { height: 100 },
                    createError?.nutritions ? styles.err_border : styles.bl_err,
                  ]}
                  multiline={true}
                  onChangeText={(itemValue: string) =>
                    handleChangeContent(itemValue, "nutritions")
                  }
                />
              </View> */}
              <View
                style={{
                  padding: 10,
                  flexDirection: "column",
                  gap: 10,
                }}
              >
                {nutritions &&
                  nutritions.map((input, index) => (
                    <View
                      key={index}
                      style={{ flexDirection: "row", alignItems: "center" }}
                    >
                      <View
                        style={{
                          borderWidth: 0.4,
                          borderColor: "#ccc",
                          flex: 1,
                          borderRadius: 5,
                        }}
                      >
                        <Text
                          style={{
                            fontFamily: "Poppins",
                            fontSize: 15,
                            padding: 10,
                          }}
                        >
                          {input}
                        </Text>
                      </View>
                      <Pressable onPress={() => handleRemoveInput(index, 'nutri')}>
                        <AntDesign name="close" size={24} color="black" />
                      </Pressable>
                    </View>
                  ))}
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <TextInput
                    placeholder="nutritions"
                    style={{
                      borderWidth: 0.4,
                      padding: 5,
                      borderRadius: 5,
                      flex: 1,
                    }}
                    value={currN}
                    onChangeText={setCurrN}
                  />
                  <Pressable onPress={()=> handleAddInput("nutri")}>
                    <Ionicons name="add-circle" size={24} color="black" />
                  </Pressable>
                </View>
              </View>
              <View
                style={{ flexDirection: "row", alignItems: "center", gap: 15 }}
              >
                <Feather
                  name="shopping-cart"
                  size={24}
                  color="black"
                  style={{ paddingLeft: 5 }}
                />
                <Text style={{ fontFamily: "Poppins" }}>Ingredients</Text>
              </View>
              {/* <View style={{ position: "relative" }}>
                {createError?.ingredients && (
                  <Text style={styles.err_panel}>
                    {createError.ingredients}
                  </Text>
                )}
                <TextInput
                  placeholder="use a comma and 2 space for input format"
                  style={[
                    styles.txt_multi,
                    { height: 100 },
                    createError?.ingredients
                      ? styles.err_border
                      : styles.bl_err,
                  ]}
                  multiline={true}
                  onChangeText={(itemValue: string) =>
                    handleChangeContent(itemValue, "ingredients")
                  }
                />
              </View> */}
              <View
                style={{
                  padding: 10,
                  flexDirection: "column",
                  gap: 10,
                }}
              >
                {ingredients &&
                  ingredients.map((input, index) => (
                    <View
                      key={index}
                      style={{ flexDirection: "row", alignItems: "center" }}
                    >
                      <View
                        style={{
                          borderWidth: 0.4,
                          borderColor: "#ccc",
                          flex: 1,
                          borderRadius: 5,
                        }}
                      >
                        <Text
                          style={{
                            fontFamily: "Poppins",
                            fontSize: 15,
                            padding: 10,
                          }}
                        >
                          {input}
                        </Text>
                      </View>
                      <Pressable onPress={() => handleRemoveInput(index, 'ingr')}>
                        <AntDesign name="close" size={24} color="black" />
                      </Pressable>
                    </View>
                  ))}
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <TextInput
                    placeholder="ingredients"
                    style={{
                      borderWidth: 0.4,
                      padding: 5,
                      borderRadius: 5,
                      flex: 1,
                    }}
                    value={currI}
                    onChangeText={setCurrI}
                  />
                  <Pressable onPress={()=> handleAddInput("ingr")}>
                    <Ionicons name="add-circle" size={24} color="black" />
                  </Pressable>
                </View>
              </View>

              <View
                style={{ flexDirection: "row", alignItems: "center", gap: 15 }}
              >
                <Entypo
                  name="list"
                  size={24}
                  color="black"
                  style={{ paddingLeft: 5 }}
                />
                <Text style={{ fontFamily: "Poppins" }}>Directions</Text>
              </View>
              {/* <View style={{ position: "relative" }}>
                {createError?.nutritions && (
                  <Text style={styles.err_panel}>{createError.nutritions}</Text>
                )}
                <TextInput
                  placeholder="use a comma and 2 space for input format"
                  style={[
                    styles.txt_multi,
                    { height: 100 },
                    createError?.directions ? styles.err_border : styles.bl_err,
                  ]}
                  multiline={true}
                  onChangeText={(itemValue: string) =>
                    handleChangeContent(itemValue, "directions")
                  }
                />
              </View> */}
              <View
                style={{
                  padding: 10,
                  flexDirection: "column",
                  gap: 10,
                }}
              >
                {directions &&
                  directions.map((input, index) => (
                    <View
                      key={index}
                      style={{ flexDirection: "row", alignItems: "center" }}
                    >
                      <View
                        style={{
                          borderWidth: 0.4,
                          borderColor: "#ccc",
                          flex: 1,
                          borderRadius: 5,
                        }}
                      >
                        <Text
                          style={{
                            fontFamily: "Poppins",
                            fontSize: 15,
                            padding: 10,
                          }}
                        >
                          {input}
                        </Text>
                      </View>
                      <Pressable onPress={() => handleRemoveInput(index, "dire")}>
                        <AntDesign name="close" size={24} color="black" />
                      </Pressable>
                    </View>
                  ))}
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <TextInput
                    placeholder="directions"
                    style={{
                      borderWidth: 0.4,
                      padding: 5,
                      borderRadius: 5,
                      flex: 1,
                    }}
                    value={currD}
                    onChangeText={setCurrD}
                  />
                  <Pressable onPress={()=> handleAddInput("dire")}>
                    <Ionicons name="add-circle" size={24} color="black" />
                  </Pressable>
                </View>
              </View>
            </View>
            <Pressable
              android_ripple={{ color: "rgba(0, 0, 0, 0.1)" }}
              onPress={() => handleSubmit()}
              style={{
                backgroundColor: "rgba(230, 138, 0, 0.9)",
                padding: 15,
                borderRadius: 10,
              }}
            >
              <Text
                style={{
                  color: "#fff",
                  textAlign: "center",
                  fontFamily: "Poppins",
                }}
              >
                ADD RECIPE
              </Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </CustomView>
  );
}

const styles = StyleSheet.create({
  input_group: {
    position: "relative",
  },
  input_icon: {
    position: "absolute",
    top: 10,
    left: 5,
  },
  txt_input: {
    padding: 10,
    paddingLeft: 40,
    fontFamily: "Poppins",
    backgroundColor: "rgba(230, 138, 0, 0.1)",
    borderRadius: 5,
  },
  txt_picker: {
    backgroundColor: "#f2f2f2",
  },

  txt_multi: {
    fontFamily: "Poppins",
    backgroundColor: "#fff",
    borderColor: "#ccc",
    borderRadius: 5,
    paddingLeft: 10,
    paddingRight: 10,
    elevation: 1,
  },
  err_panel: {
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
    zIndex: 1,
  },
  err_border: {
    borderWidth: 0.4,
    borderColor: "red",
    borderRadius: 10,
  },
  bl_err: {},
});
