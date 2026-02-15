import { supabase } from "@/src/api/supabase";
import { useUser } from "@/src/contexts/userContext";
import { Button } from "@react-navigation/elements";
import { router } from "expo-router";
import React, { useState } from "react";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { Dropdown } from "react-native-element-dropdown";

const usersettings = () => {
  const { userSettingsData, userId, refreshUserData } = useUser();
  const [distanceUnit, setDistanceUnit] = useState(
    userSettingsData?.distance_unit,
  );
  const [isFocus, setIsFocus] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  console.log(
    "userSettingsData?.distance_unit: ",
    userSettingsData?.distance_unit,
  );

  const renderLabel = () => {
    if (distanceUnit || isFocus) {
      return (
        <Text style={[styles.label, isFocus && { color: "blue" }]}>
          Dropdown label
        </Text>
      );
    }
    return null;
  };
  const handleSubmit = async () => {
    try {
      const { error } = await supabase
        .from("user_config")
        .update({ distance_unit: distanceUnit }) // Use an object with the column name
        .eq("user_id", userId); // Filter by the logged-in user!

      if (error) throw error;

      console.log("Settings updated successfully!");
      if (userId) {
        refreshUserData(userId);
      }
    } catch (error) {
      console.error("Error updating config:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Button
        style={{ position: "absolute", top: 30, left: 2, zIndex: 2 }}
        onPress={() => router.push("/dashboard/dashboardscreen")}
      >
        Back
      </Button>
      <View style={styles.menuGrid}>
        {renderLabel()}
        <Dropdown
          style={[styles.dropdown, isFocus && { borderColor: "blue" }]}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          inputSearchStyle={styles.inputSearchStyle}
          iconStyle={styles.iconStyle}
          data={[
            { label: "Miles", value: "miles" },
            { label: "Kilometers", value: "kilometers" },
          ]}
          search
          maxHeight={300}
          labelField="label"
          valueField="value"
          placeholder={!isFocus ? "Select item" : "..."}
          searchPlaceholder="Search..."
          value={distanceUnit}
          onFocus={() => setIsFocus(true)}
          onBlur={() => setIsFocus(false)}
          onChange={(item) => {
            console.log("item set:", item.value);
            setDistanceUnit(item.value);
            setIsFocus(false);
          }}
        />
      </View>
      <View style={styles.submitContainer}>
        <Pressable
          style={[styles.menuButton, styles.submitButton]}
          onPress={() => setModalVisible(true)}
        >
          <Text style={{ color: "black", fontWeight: "bold" }}>Submit</Text>
        </Pressable>
      </View>
      <Modal animationType="slide" transparent={true} visible={modalVisible}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text>Are you sure you want to submit changes?</Text>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                paddingTop: 15,
                width: 170,
              }}
            >
              <Pressable
                style={{
                  width: 60,
                  alignItems: "center",
                  padding: 12,
                  borderRadius: 12,
                  backgroundColor: "#ff4444",
                  cursor: "pointer",
                }}
                onPress={() => setModalVisible(false)}
              >
                <Text style={{ color: "white" }}>No</Text>
              </Pressable>
              <Pressable
                onPress={() => {
                  handleSubmit();
                  setModalVisible(false);
                }}
                style={{
                  width: 60,
                  alignItems: "center",
                  padding: 12,
                  borderRadius: 12,
                  backgroundColor: "transparent",
                  borderWidth: 1,
                  borderColor: "black",
                  cursor: "pointer",
                }}
              >
                <Text>Yes</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default usersettings;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 20,
  },
  menuGrid: {
    top: 80,
    flexDirection: "column",
    justifyContent: "space-around",
    padding: 15,
    gap: 15,
  },
  dropdown: {
    height: 50,
    borderColor: "gray",
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
  },
  icon: {
    marginRight: 5,
  },
  label: {
    position: "absolute",
    backgroundColor: "white",
    left: 22,
    top: 8,
    zIndex: 999,
    paddingHorizontal: 8,
    fontSize: 14,
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
  menuButton: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 12,
    width: "45%",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    elevation: 3,
  },
  submitContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "white", // Background ensures content doesn't bleed through
    paddingBottom: 30, // Safe area for modern phones
    paddingHorizontal: 20,
    paddingTop: 10,
    borderTopWidth: 1,
    borderColor: "#eee",
    alignItems: "center",
  },
  submitButton: {
    //backgroundColor: "#ff4444",
    padding: 16,
    borderRadius: 12,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
});
