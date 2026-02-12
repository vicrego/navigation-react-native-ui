import { faCircleUser } from "@fortawesome/free-solid-svg-icons/faCircleUser";
import { faEllipsis } from "@fortawesome/free-solid-svg-icons/faEllipsis";
import { faLocationCrosshairs } from "@fortawesome/free-solid-svg-icons/faLocationCrosshairs";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { Button } from "@react-navigation/elements";
import Mapbox from "@rnmapbox/maps";
import "expo-dev-client";
import { router } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { supabase } from "../api/supabase";
import ArrivalModal from "../components/ArrivalModal";
import MapboxComponents from "../components/MapboxComponents";
import NavigationInfo from "../components/NavigationInfo";
import SearchComponent from "../components/SearchComponent";
import SignInModal from "../components/SignInModal";
import useLocations from "../hooks/useLocations";
import { useRoutes } from "../hooks/useRoutes";
import { NavigationState } from "../types/navigation";
import { calculationDistanceAndDuration } from "../utils/navigationUtils";

let publicToken = process.env.EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN;
if (publicToken) {
  Mapbox.setAccessToken(publicToken);
}
const Index = () => {
  //Index manages every state that will be displayed or used by shared component
  const [destinationRoute, setDestinationRoute] = useState(null);
  const [destinationDistance, setDestinationDistance] = useState(0); // Static Number
  const [destinationDuration, setDestinationDuration] = useState(0); // Static Number
  const [currentDistanceDuration, setCurrentDistanceDuration] =
    useState<NavigationState | null>(null); // Dynamic Numbers (Based On Route)
  const [placeName, setPlaceName] = useState();
  const [searchComponentOn, setSearchComponentOn] = useState(false);
  const [destinationCoords, setDestinationCoords] = useState<any>([null]);
  const [destinationReached, setDestinationReached] = useState(false);
  const [isFollowingRoute, setIsFollowingRoute] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  //Gets permission and sets coordinates based on user's location
  const currentLocation = useLocations();

  const cameraRef = useRef<Mapbox.Camera>(null);
  const [storedData, setStoredData] = useState<any>([]);
  const { saveCurrentRoute, loading } = useRoutes();

  useEffect(() => {
    // Listen for changes (Login, Logout, Token Refresh)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        console.log("User is logged in:", session.user.email);
        getStoredData();
      } else {
        console.log("User is logged out");
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  async function getStoredData() {
    const { data } = await supabase.from("Test").select();
    console.log("data", data);
    setStoredData(data);
  }

  // FollowingRoute Logic
  useEffect(() => {
    if (
      destinationCoords?.latitude &&
      destinationCoords?.longitude &&
      !destinationReached
    ) {
      setIsFollowingRoute(true);
    } else {
      setIsFollowingRoute(false);
    }
  }, [
    destinationCoords?.latitude,
    destinationCoords?.longitude,
    destinationReached,
  ]);

  //Save Completed Route Into Supabase's Database
  useEffect(() => {
    const isArriving =
      currentDistanceDuration !== null &&
      currentDistanceDuration.remainingMiles <= 0.028;
    if (isFollowingRoute && isArriving) {
      console.log("Hereee");
      saveCurrentRoute(
        currentDistanceDuration.remainingLine.geometry,
        destinationDistance,
        destinationDuration,
        destinationCoords,
      );
    }
  }, [
    isFollowingRoute,
    currentDistanceDuration !== null &&
      currentDistanceDuration?.remainingMiles <= 0.028,
  ]);

  //Resets destination State
  useEffect(() => {
    !!destinationDistance &&
      setCurrentDistanceDuration(
        calculationDistanceAndDuration(
          currentLocation,
          destinationDistance,
          destinationDuration,
          destinationRoute,
        ),
      );
    if (currentDistanceDuration?.remainingMiles !== undefined) {
      if (currentDistanceDuration.remainingMiles <= 0.03) {
        setDestinationReached(true);
        setCurrentDistanceDuration(null);
        setDestinationDuration(0);
        setDestinationDistance(0);
        setDestinationCoords(undefined);
      }
    }
  }, [destinationDistance, currentLocation, destinationRoute]);

  //BUTTONS
  const handleRecenter = () => {
    if (!isFollowingRoute) {
      return cameraRef.current?.setCamera({
        centerCoordinate: [currentLocation.longitude, currentLocation.latitude],
        zoomLevel: 15,
        animationDuration: 1000,
      });
    }
    //This resets followUserLocation, so the camera follows the currentLocation during FollowingRoute
    setIsFollowingRoute(false);
    setTimeout(() => setIsFollowingRoute(true), 10);
  };

  const handlePress = () => {
    setSearchComponentOn(true);
  };

  supabase.auth.signInWithOAuth({
    provider: "google",
  });

  return (
    <View style={styles.container}>
      {!destinationDistance || searchComponentOn ? (
        <SearchComponent
          publicToken={publicToken}
          currentLocation={currentLocation}
          setDestinationRoute={setDestinationRoute}
          setDestinationDistance={setDestinationDistance}
          setDestinationDuration={setDestinationDuration}
          destinationCoords={destinationCoords}
          setDestinationCoords={setDestinationCoords}
          setPlaceName={setPlaceName}
        />
      ) : (
        <View
          style={{
            position: "absolute",
            top: 50,
            right: 25,
            alignSelf: "flex-end",
            zIndex: 1,
          }}
        >
          <Pressable onPress={handlePress}>
            <FontAwesomeIcon
              icon={faEllipsis as any}
              style={{ color: "white" }}
              size={30}
            />
          </Pressable>
        </View>
      )}
      <View
        style={{
          position: "absolute",
          top: 800,
          right: 25,
          alignSelf: "flex-end",
          zIndex: 1,
        }}
      >
        <Pressable onPress={() => handleRecenter()}>
          <FontAwesomeIcon
            icon={faLocationCrosshairs as any}
            style={{ color: "white" }}
            size={50}
          />
        </Pressable>
      </View>
      {modalVisible && (
        <SignInModal
          modalVisible={modalVisible}
          setModalVisible={setModalVisible}
        />
      )}
      <Pressable
        style={{
          position: "absolute",
          top: 200,
          padding: 20,
          borderRadius: 20,
          zIndex: 1,
          backgroundColor: "blue",
        }}
        onPress={() => setModalVisible(true)}
      >
        <FontAwesomeIcon
          icon={faCircleUser as any}
          style={{ color: "white" }}
          size={50}
        />
      </Pressable>
      {!!destinationDistance &&
        !!currentDistanceDuration /*&& !destinationReached*/ && (
          <NavigationInfo
            placeName={placeName}
            currentDistanceDuration={currentDistanceDuration}
          />
        )}
      <ArrivalModal
        destinationReached={destinationReached}
        setDestinationReached={setDestinationReached}
        setDestinationCoords={setDestinationCoords}
      />
      <Button
        //title="Go to Dashboard"
        style={{ position: "absolute", top: 300, zIndex: 2 }}
        onPress={() => router.push("/dashboard")}
      >
        Go to Details
      </Button>
      <MapboxComponents
        currentLocation={currentLocation}
        setSearchComponent={setSearchComponentOn}
        cameraRef={cameraRef}
        isFollowingRoute={isFollowingRoute}
        destinationCoords={destinationCoords}
        currentDistanceDuration={currentDistanceDuration}
        destinationReached
      />
    </View>
  );
};

export default Index;

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  map: {
    flex: 1,
  },
  annotationContainer: {
    width: 30,
    height: 30,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
    borderRadius: 15,
  },
  annotationFill: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "blue", // Your brand color
    transform: [{ scale: 0.6 }],
  },
});
