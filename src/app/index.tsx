import { faEllipsis } from '@fortawesome/free-solid-svg-icons/faEllipsis';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { Text } from '@react-navigation/elements';
import Mapbox from '@rnmapbox/maps';
import 'expo-dev-client';
import React, { useEffect, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import ArrivalModal from '../components/ArrivalModal';
import NavigationInfo from '../components/NavigationInfo';
import SearchComponent from '../components/SearchComponent';
import useLocations from '../hooks/useLocations';
import { calculationDistanceAndDuration } from '../utils/navigationUtils';

let publicToken = "pk.eyJ1IjoidmljcmVnbyIsImEiOiJjbWc2OWQ2cjkwYmR3MmxzZHZ4aWpzcDM2In0.7_PNb8rw61ISZt1Q7ysIuw";
Mapbox.setAccessToken(publicToken);

const Index = () => {
  //Index manages every state that will be displayed or used by shared component
  const [destinationRoute, setDestinationRoute] = useState(null);
  const [destinationDistance, setDestinationDistance] = useState(0);
  const [destinationDuration, setDestinationDuration] = useState(0);
  const [placeName, setPlaceName] = useState();
  const [shortName, setShortName] = useState();
  const [currentDistanceDuration, setCurrentDistanceDuration] = useState<any>(0);
  const [searchComponent, setSearchComponent] = useState(false);
  const [destinationCoords, setDestinationCoords] = useState<any>([null]);
  const [destinationReached, setDestinationReached] = useState(false);

  //Gets permission and sets coordinates based on user's location
  const currentLocation = useLocations();
  
  useEffect(() => {   
    destinationDistance && (
      setCurrentDistanceDuration(calculationDistanceAndDuration(currentLocation, destinationDistance, destinationDuration, destinationRoute))
    )   
    if(currentDistanceDuration !== 0){
      if(currentDistanceDuration.remainingMiles.toFixed(3) <= 0.03){
        
        
        //RESET DESTINATION STATE
        setDestinationReached(true);
        console.log("destinationReached: ", destinationReached);
        setCurrentDistanceDuration(0);
        setDestinationDuration(0);
        setDestinationDistance(0);
        console.log("ARRIIIIIIVED 2");
      }
    }
  }, [destinationDistance, currentLocation, destinationRoute]);

  const handlePress = () => {
    setSearchComponent(true);
  }

  return (
    <View style={styles.container}>
      {!destinationDistance || searchComponent ? (
        <SearchComponent
          publicToken={publicToken}
          currentLocation={currentLocation}
          setDestinationRoute={setDestinationRoute}
          setDestinationDistance={setDestinationDistance}
          setDestinationDuration={setDestinationDuration}
          destinationCoords={destinationCoords}
          setDestinationCoords={setDestinationCoords}
          setPlaceName={setPlaceName}
          setShortName={setShortName}
          //currentDistance={setCurrentDistance}
          //setCurrentDistanceDuration={setCurrentDistanceDuration}
          onSelect={(coords: any) => {
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
      
      { (destinationDistance && currentDistanceDuration && !destinationReached) &&
        <NavigationInfo placeName={placeName} shortName={shortName} currentDistanceDuration={currentDistanceDuration}/>
      }
      {
        <ArrivalModal destinationReached={destinationReached} setDestinationReached={setDestinationReached}/>
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
          {(destinationCoords.latitude && destinationCoords.longitude) && 
            <Mapbox.PointAnnotation
              id="userLocation"
              coordinate={[
                destinationCoords.latitude, 
                destinationCoords.longitude
              ]}
            >
              <View style={{
                height: 30, 
                width: 30, 
                backgroundColor: '#00cccc', 
                borderRadius: 50, 
                borderColor: '#fff', 
                borderWidth: 3
                }} 
              />
            </Mapbox.PointAnnotation>
          }
          {currentDistanceDuration && 
            <Mapbox.ShapeSource id="routeSource" shape={currentDistanceDuration.remainingLine.geometry}>
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
          }
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



