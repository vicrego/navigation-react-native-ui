import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { Button, Text } from "@react-navigation/elements";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Modal,
  Pressable,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { supabase } from "../../api/supabase";

export default function DashBoardScreen() {
  const params = useLocalSearchParams();
  const [routes, setRoutes] = useState<any>([]);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const getStoredData = async () => {
      const { data, error } = await supabase.from("saved_routes").select();
      if (data) setRoutes(data);
    };
    getStoredData();
  }, []);

  const handleLogout = async () => {
    try {
      // Sign out from Supabase (removes the session from storage)
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      await GoogleSignin.signOut();

      router.push({
        pathname: "/",
      });
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Button
        //title="Go to Dashboard"
        style={{ position: "absolute", top: 30, left: 2, zIndex: 2 }}
        onPress={() => router.push("/")}
      >
        Back
      </Button>
      {/* Action Menu */}
      <View style={styles.menuGrid}>
        <TouchableOpacity
          style={styles.menuButton}
          onPress={() => {
            router.push({
              pathname: "/dashboard/savedroutes",
              params: { routeData: JSON.stringify(routes) }, // Stringify the specific row
            });
          }}
        >
          <Text>Saved Routes</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.logoutContainer}>
        <Pressable
          style={[styles.menuButton, styles.logoutButton]}
          onPress={() => setModalVisible(true)}
        >
          <Text style={{ color: "black", fontWeight: "bold" }}>Sign Out</Text>
        </Pressable>
        <Modal animationType="slide" transparent={true} visible={modalVisible}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text>Are you sure you want to loggout?</Text>
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
                    handleLogout();
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 20,
  },
  title: { fontWeight: "bold", fontSize: 16 },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  menuGrid: {
    top: 80,
    flexDirection: "column",
    justifyContent: "space-around",
    padding: 15,
    gap: 15,
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
  logoutContainer: {
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
  logoutButton: {
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
