import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Alert,
  StyleSheet,
  TouchableOpacity,
  TextInput
} from "react-native";
import Parse from "parse/react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { StackActions, useNavigation } from "@react-navigation/native";

Parse.setAsyncStorage({ AsyncStorage });
Parse.initialize(
  "0dyjfXKItbkSKG2YaOxFtUAxkhY98oL3pNd8eSzs",
  "j8PP6pYFYQ3SBZZCOuUDj2ZGO2zUnlTRRvkjMiUX"
);
Parse.serverURL = "https://parseapi.back4app.com/";

export default function UserLogin({ route }) {
  const { setIsLoggedIn } = route.params;
  const navigation = useNavigation();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [handicap, setHandicap] = useState("");

  const handleLogin = async function () {
    const usernameValue = username;
    const passwordValue = password;

    return await Parse.User.logIn(usernameValue, passwordValue)
      .then(() => {
        Alert.alert(`User ${username} has been logged in`);
        // setCurrentUser(loggedInUser);
        // props.toggleLoggedIn(true);
        AsyncStorage.setItem("keepLoggedIn", JSON.stringify(true));
        setIsLoggedIn(true)
        console.log(`${username} logged in`);
        navigation.navigate("Home");
        return true;
      })
      .catch((error) => {
        console.log(error);
        Alert.alert(
          "Invalid credentials",
          "Please check your username and password and try again."
        );
      });
  };

  return (
    <View style={{ backgroundColor: "#282634", height: "100%" }}>
      {/* <View style={styles.notLoggedInContainer}>
        <View style={styles.login}>
          <UserLogin
            route={route}
            setUsername={setUsername}
            setPassword={setPassword}
          />
        </View>
      </View>
      */}

<View style={styles.login}>
        {/* <StatusBar style="auto" /> */}
        <View style={styles.inputView}>
          <TextInput
            style={styles.textInput}
            value={username}
            placeholder={"Username"}
            placeholderTextColor="#453f3a"
            onChangeText={(text) => setUsername(text)}
            autoCapitalize={"none"}
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
  );
}

const styles = StyleSheet.create({
  logout: {
    position: "absolute",
    top: 10,
    right: 0,
    backgroundColor: "#DCDCDC",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
    elevation: 4,
  },
  tourny: {
    position: "relative",
    marginTop: 60,
    minHeight: 250,
  },
  notLoggedInContainer: {
    flex: 1,
    minHeight: "100%",
    // borderColor: 'gold',
    // borderWidth: 3,
  },
  login: {},
  firstTimer: {
    // marginLeft: 250,
    marginTop: 200,
    width: "100%",
    backgroundColor: "#ff4057",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    paddingVertical: 30,
    elevation: 4,
  },
  scorecard: {
    minHeight: 300,
  },

  createUserButton: {
    width: 200,
    borderRadius: 25,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    backgroundColor: "#DCDCDC",
    color: "black",
    elevation: 4,
  },
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
    justifyContent: 'center'
  },
  textInput: {
    height: 50,
    flex: 1,
    padding: 10,
    marginLeft: 20,
    fontSize: 14,
    color: 'black',
    fontStyle: 'italic',
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
    fontWeight: 'bold',
    elevation: 5
  },
});
