import React, { useState, useContext } from "react";
import {
  View,
  Text,
  Alert,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from "react-native";
import Parse from "parse/react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { AuthContext } from "./context/AuthContext";

Parse.setAsyncStorage({ AsyncStorage });
Parse.initialize(
  "0dyjfXKItbkSKG2YaOxFtUAxkhY98oL3pNd8eSzs",
  "j8PP6pYFYQ3SBZZCOuUDj2ZGO2zUnlTRRvkjMiUX"
);
Parse.serverURL = "https://parseapi.back4app.com/";

export default function UserLogin() {
  const navigation = useNavigation();
  const { username, setUsername } = useContext(AuthContext);
  const { handicap, setHandicap } = useContext(AuthContext);
  const [password, setPassword] = useState("");
  const [tempUsername, setTempUsername] = useState("");

  const handleLogin = async function () {
    const usernameValue = tempUsername;
    const passwordValue = password;

    return await Parse.User.logIn(usernameValue, passwordValue)
      .then(async (loggedInUser) => {
        const currentUser = await Parse.User.currentAsync();
        if (currentUser === loggedInUser) {
          setUsername(usernameValue);
          setHandicap(currentUser.get("handicap"));
          Alert.alert(
            `${usernameValue} (${currentUser.get(
              "handicap"
            )}) has been logged in!`
          );
        }
        navigation.navigate("Home");
        return true;
      })
      .catch((error) => {
        console.log("USERLOGIN ERROR: ", error);
        Alert.alert(
          "Invalid credentials",
          "Please check your username and password and try again."
        );
      });
  };

  return (
    <View style={{ backgroundColor: "#282634", height: "100%" }}>
      <View style={styles.container}>

        <View style={styles.login}>
          <View style={styles.inputView}>
            <TextInput
              style={styles.textInput}
              value={username}
              placeholder={"Name"}
              placeholderTextColor="#453f3a"
              onChangeText={(text) => setTempUsername(text)}
              keyboardType={"email-address"}
            />
          </View>

          <View style={styles.inputView}>
            <TextInput
              style={styles.textInput}
              value={password}
              placeholder={"Password"}
              placeholderTextColor="#453f3a"
              secureTextEntry
              onChangeText={(text) => setPassword(text)}
            />
          </View>

          <TouchableOpacity>
            <Text style={styles.forgot_button}>Forgot Password?</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.loginBtn} onPress={handleLogin}>
            <Text style={styles.loginText}>LOGIN</Text>
          </TouchableOpacity>
          
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
    marginHorizontal: 8,
    backgroundColor: "#282634",
    marginTop: 80,
  },
  login: {
    // flex: 1,
    backgroundColor: "#ff4057",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    paddingVertical: 30,
    elevation: 4,
    // marginTop: 150,
  },
  inputView: {
    backgroundColor: "#DCDCDC",
    borderRadius: 30,
    width: "60%",
    height: 45,
    marginBottom: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  textInput: {
    height: 50,
    flex: 1,
    padding: 10,
    marginLeft: 20,
    fontSize: 14,
    color: "black",
    fontStyle: "italic",
  },
  loginText: {
    fontSize: 20,
  },
  forgot_button: {
    height: 30,
    marginTop: 10,
    // marginBottom: 15,
    color: "black",
  },
  loginBtn: {
    width: "70%",
    borderRadius: 25,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 1,
    backgroundColor: "#DCDCDC",
    fontWeight: "bold",
    elevation: 5,
  },
});
