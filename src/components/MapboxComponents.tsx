import { Text } from "@react-navigation/elements";
import Mapbox, { UserTrackingMode } from "@rnmapbox/maps";
import React from "react";
import { StyleSheet, View } from "react-native";

const MapboxComponents = ({
  currentLocation,
  setSearchComponent,
  cameraRef,
  isFollowingRoute,
  destinationCoords,
  currentDistanceDuration,
  destinationReached,
}: any) => {
  return (
    <Mapbox.MapView
      style={styles.map}
      styleURL={Mapbox.StyleURL.Dark}
      rotateEnabled={true}
      pitchEnabled={true}
      onPress={() => setSearchComponent(false)}
    >
      {currentLocation ? (
        <>
          <Mapbox.Camera
            ref={cameraRef}
            zoomLevel={15}
            // Allow user to see the whole city
            minZoomLevel={10}
            // Allow user to see street details
            maxZoomLevel={19}
            maxBounds={{
              sw: [-0.489, 51.28],
              ne: [0.236, 51.686],
            }}
            // Follows current user location once a route is established
            followUserLocation={isFollowingRoute}
            followUserMode={UserTrackingMode.FollowWithCourse}
            defaultSettings={{
              zoomLevel: 15,
              centerCoordinate: [
                currentLocation?.longitude,
                currentLocation?.latitude,
              ],
            }}
            animationMode={"flyTo"}
            pitch={60}
            animationDuration={3000}
          />
          <Mapbox.Images
            images={{
              "car-arrow": require("../../assets/images/arrow.png"),
            }}
          />
          <Mapbox.LocationPuck
            puckBearingEnabled={true}
            puckBearing="course" // Points the arrow where the car is moving
            //topImage={require('./assets/nav-arrow.png')} // Your custom arrow image
            //shadowImage={require('./assets/puck-shadow.png')}
            topImage="car-arrow"
            scale={0.2}
          />

          {isFollowingRoute && !destinationReached && (
            <Mapbox.PointAnnotation
              id="destinationMarker"
              coordinate={[
                destinationCoords?.longitude,
                destinationCoords?.latitude,
              ]}
            >
              <View
                style={{
                  height: 20,
                  width: 20,
                  backgroundColor: "#00cccc",
                  borderRadius: 50,
                  borderColor: "#fff",
                  borderWidth: 3,
                }}
              />
            </Mapbox.PointAnnotation>
          )}
          {!!currentDistanceDuration && (
            <Mapbox.ShapeSource
              id="routeSource"
              shape={currentDistanceDuration.remainingLine.geometry}
            >
              <Mapbox.LineLayer
                id="routeLine"
                style={{
                  lineColor: "#007AFF",
                  lineWidth: 9,
                  lineJoin: "round",
                  lineCap: "round",
                }}
              />
            </Mapbox.ShapeSource>
          )}
        </>
      ) : (
        <View>
          <Text>Waiting for location...</Text>
        </View>
      )}
    </Mapbox.MapView>
  );
};

export default MapboxComponents;

const styles = StyleSheet.create({
  map: {
    flex: 1,
  },
});
