import { faAngleLeft } from "@fortawesome/free-solid-svg-icons/faAngleLeft";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { router } from "expo-router";
import React from "react";
import { Pressable, StyleSheet, View } from "react-native";

const DashboardLayoult = ({ children, routerPath }: any) => {
  return (
    <View style={styles.container}>
      <Pressable
        style={{
          position: "absolute",
          top: 30,
          left: 2,
          zIndex: 2,
        }}
        onPress={() => {
          router.push({
            pathname: routerPath,
          });
        }}
      >
        <FontAwesomeIcon icon={faAngleLeft as any} size={30} />
      </Pressable>
      {children}
    </View>
  );
};

export default DashboardLayoult;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 20,
  },
});
