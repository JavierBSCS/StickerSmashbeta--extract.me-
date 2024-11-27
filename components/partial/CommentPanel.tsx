import { StyleSheet, Text, View, Modal, Pressable } from "react-native";
import React, { useState } from "react";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import AntDesign from "@expo/vector-icons/AntDesign";
import Feather from "@expo/vector-icons/Feather";

export default function CommentPanel() {
  const [modalVisible, setModalVisible] = useState(false);

  const handleCloseModal = () => {
    setModalVisible(false);
  };

  return (
    <View style={styles.centeredView}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={handleCloseModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalView}>
            <Pressable style={[styles.buttonClose]} onPress={handleCloseModal}>
              <AntDesign name="closecircle" size={24} color="black" />
            </Pressable>
            <Text style={styles.modalText}>Hello World!</Text>
          </View>
        </View>
      </Modal>
      <View style={{ flexDirection: "row", gap: 5, alignItems: "flex-end" }}>
        <Pressable
          onPress={() => setModalVisible(true)}
          android_ripple={{
            color: "rgba(0, 0, 0, 0.1)",
            borderless: false,
            radius: 17
          }}
        >
          <Feather name="message-circle" size={24} color="black" />
        </Pressable>
        <Text style={{ fontFamily: "Poppins" }}>5</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  centeredView: {
    justifyContent: "flex-end",
    alignItems: "flex-end",
    position: "static",
    bottom: 0,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  modalView: {
    backgroundColor: "#fff",
    padding: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    width: "100%",
    height: "60%",
  },
  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  buttonClose: {
    alignItems: "flex-end",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
});
