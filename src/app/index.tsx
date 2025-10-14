import { faEllipsis } from '@fortawesome/free-solid-svg-icons/faEllipsis';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { Text } from '@react-navigation/elements';
import Mapbox from '@rnmapbox/maps';
import 'expo-dev-client';
import React, { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import NavigationInfo from '../components/NavigationInfo';
import SearchComponent from '../components/SearchComponent';
import useLocations from '../hooks/useLocations';

let publicToken = "pk.eyJ1IjoidmljcmVnbyIsImEiOiJjbWc2OWQ2cjkwYmR3MmxzZHZ4aWpzcDM2In0.7_PNb8rw61ISZt1Q7ysIuw";
Mapbox.setAccessToken(publicToken);

const Index = () => {
  const [route, setRoute] = useState(null);
  const [distance, setDistance] = useState();
  const [duration, setDuration] = useState();
  const [placeName, setPlaceName] = useState();
  const [shortName, setShortName] = useState();
  const [searchComponent, setSearchComponent] = useState(false);
  const [destinationCoords, setDestinationCoords] = useState([null]);
  
  //Gets permission and sets coordinates based on user's location
  const currentLocation = useLocations();

  const handlePress = () => {
    setSearchComponent(true);
  }

  return (
    <View style={styles.container}>
      {!distance || searchComponent ? (
        <SearchComponent
          publicToken={publicToken}
          currentLocation={currentLocation}
          setRoute={setRoute}
          setDistance={setDistance}
          setDuration={setDuration}
          setPlaceName={setPlaceName}
          setShortName={setShortName}
          onSelect={(coords: any) => {
            console.log("Selected coords:", coords);
            //console.log("currentLocation", currentLocation)
            // Move Mapbox camera or request directions
          }}    
        />) : (
          <View style={{position: 'absolute', top: 50, right: 25, alignSelf: "flex-end", zIndex: 1}}>
            <Pressable onPress={handlePress}>
              <FontAwesomeIcon icon={faEllipsis} style={{color: "white"}} size={30} />
            </Pressable>
          </View>
        )
      }
      { distance &&
        <NavigationInfo distance={distance} duration={duration} placeName={placeName} shortName={shortName}/>
      }
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
            zoomLevel={15}
            centerCoordinate={[currentLocation.longitude, currentLocation.latitude]}
            animationMode={'flyTo'}
            pitch={60}
            animationDuration={6000}
          />
      
          <Mapbox.PointAnnotation
            id="userLocation"
            coordinate={[currentLocation.longitude, currentLocation.latitude]}
          />

          {(destinationCoords.destLat && destinationCoords.destLng) && 
              <Mapbox.PointAnnotation
                id="userLocation"
                coordinate={[
                  destinationCoords.destLng, 
                  destinationCoords.destLat
                ]}
              >
                <View style={{
                  height: 30, 
                  width: 30, 
                  backgroundColor: '#00cccc', 
                  borderRadius: 50, 
                  borderColor: '#fff', 
                  borderWidth: 3
            }} />
              </Mapbox.PointAnnotation>
          }
          <Mapbox.ShapeSource id="routeSource" shape={route}>
            <Mapbox.LineLayer
              id="routeLine"
              style={{
                lineColor: "#007AFF",
                lineWidth: 7,
                lineJoin: "round",
                lineCap: "round",
              }}
            />
          </Mapbox.ShapeSource>
        </>
      ) : (
        <View>
          <Text>Waiting for location...</Text>
        </View>
      )}
      </Mapbox.MapView>
    </View>
  );
};

export default Index;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  map: {
    flex: 1,
  },
});



