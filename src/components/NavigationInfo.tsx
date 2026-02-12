//import { Text } from '@react-navigation/elements';
import { faLocationDot } from "@fortawesome/free-solid-svg-icons/faLocationDot";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, Text, View } from "react-native";

const NavigationInfo = ({ placeName, currentDistanceDuration }: any) => {
  //Nav Info simply displays navigation Info to the user
  let remainingMiles = currentDistanceDuration.remainingMiles.toFixed(2);
  let remainingMinutes = currentDistanceDuration.remainingDuration;

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const fadeIn = () => {
    // Will change fadeAnim value to 1 in 5 seconds
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 2000,
      useNativeDriver: true,
    }).start();
  };
  useEffect(() => {
    fadeIn();
  }, [placeName]);

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <View style={{ left: 15, flexDirection: "row" }}>
        <View style={{ top: 16, right: 9 }}>
          <FontAwesomeIcon icon={faLocationDot as any} />
        </View>
        <View style={{ width: "90%" }}>
          <Text style={{ fontWeight: "bold" }}>{placeName.short_name}</Text>
          <Text>{placeName.place_name}</Text>
          <View
            style={{
              flexDirection: "row",
              width: 300,
              gap: 20,
              left: 35,
              marginLeft: "auto",
              marginRight: "auto",
            }}
          >
            <Text style={{ fontSize: 25 }}>
              {Math.round(remainingMinutes)} min
            </Text>
            <Text style={{ fontSize: 25 }}>{remainingMiles} mi</Text>
          </View>
        </View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 100,
    left: 10,
    right: 15,
    backgroundColor: "white",
    borderRadius: 8,
    zIndex: 1,
    padding: 5,
    elevation: 4,
    flex: 4,
  },
  input: {
    flex: 1,
    paddingHorizontal: 8,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#2180e59c",
    borderRadius: 8,
    padding: 10,
  },
});

export default NavigationInfo;
