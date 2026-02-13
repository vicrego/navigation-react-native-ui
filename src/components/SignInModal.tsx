import {
  GoogleSignin,
  GoogleSigninButton,
  isSuccessResponse,
  statusCodes,
} from "@react-native-google-signin/google-signin";
import { Text } from "@react-navigation/elements";
import { Session } from "@supabase/supabase-js";
import React, { useEffect, useState } from "react";
import { Alert, Modal, Pressable, StyleSheet, View } from "react-native";
import { supabase } from "../api/supabase";

GoogleSignin.configure({
  webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID, // Use env vars!
});

const SignInModal = ({ modalVisible, setModalVisible }: any) => {
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [isLogged, setIsLogged] = useState(false);
  const [authData, setAuthData] = useState<Session | null>(null);

  useEffect(() => {
    supabase.auth.onAuthStateChange((data, session) => {
      if (session) {
        setIsLogged(true);
      }
    });
  }, []);

  const handleSignIn = async () => {
    setIsAuthenticating(true);
    try {
      await GoogleSignin.hasPlayServices();

      const response = await GoogleSignin.signIn();
      if (isSuccessResponse(response)) {
        const token = response.data.idToken;
        if (!token) {
          console.error("No ID Token found in Google response");
          return;
        }
        const { data, error } = await supabase.auth.signInWithIdToken({
          provider: "google",
          token: token,
        });
        data.session?.user.email;
        if (!error && data) {
          setAuthData(data.session);
          setModalVisible(false); // Close the login modal
        }
        console.log(error, data);
      }
    } catch (error: any) {
      if (error.code === statusCodes.IN_PROGRESS) {
        // operation (e.g. sign in) is in progress already
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        // play services not available or outdated
      } else {
        // some other error happened
      }
    }
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => {
        Alert.alert("Modal has been closed.");
        setModalVisible(!modalVisible);
      }}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.modalText}>
            {authData?.user.email
              ? `Logged in as ${authData?.user.email}`
              : "LOGIN"}
          </Text>
          <GoogleSigninButton
            size={GoogleSigninButton.Size.Wide}
            color={GoogleSigninButton.Color.Dark}
            onPress={() => handleSignIn()}
          />
          <Pressable onPress={() => setModalVisible(false)}>
            <Text style={{ marginTop: 15, color: "gray" }}>Cancel</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
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
    width: "100%",
    height: "100%",
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
  button: {
    position: "absolute",
    zIndex: 1,
    top: 700,
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    height: 80,
  },
  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
    width: 200,
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  buttonLogout: {
    backgroundColor: "blue",
  },
});

export default SignInModal;
