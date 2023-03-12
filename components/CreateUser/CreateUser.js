import React, { useState, useContext } from "react";
import {
  View,
  TextInput,
  Text,
  Alert,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import Parse from "parse/react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { AuthContext } from "../context/AuthContext";

Parse.setAsyncStorage(AsyncStorage);
Parse.initialize(
  "0dyjfXKItbkSKG2YaOxFtUAxkhY98oL3pNd8eSzs",
  "j8PP6pYFYQ3SBZZCOuUDj2ZGO2zUnlTRRvkjMiUX"
);
Parse.serverURL = "https://parseapi.back4app.com/";

export default function CreateUser() {
  const navigation = useNavigation();
  const [email, setEmail] = useState("");
  const { username, setUsername } = useContext(AuthContext);
  const [password, setPassword] = useState("");
  const { handicap, setHandicap } = useContext(AuthContext);
  const [tempUsername, setTempUsername] = useState('');

  const doUserRegistration = async () => {
    const user = new Parse.User();
    user.set("username", tempUsername);
    user.set("password", password);
    user.set("handicap", parseInt(handicap));
    try {
      await user.signUp();
      setUsername(tempUsername);
      Alert.alert(`User ${tempUsername} (${handicap}) was successfully created!`);
    } catch (error) {
      Alert.alert(`Error!, ${error.message}`);
    }
    navigation.navigate("Home");
  };

  return (
    <View style={styles.container}>
      <View style={styles.createUserContainer}>
        <View style={styles.inputView}>
          <TextInput
            style={styles.textInput}
            value={email}
            placeholder="Email"
            onChangeText={(text) => setEmail(text)}
          />
        </View>
        <View style={styles.inputView}>
          <TextInput
            style={styles.textInput}
            value={username}
            placeholder="Name"
            onChangeText={(text) => setTempUsername(text)}
          />
        </View>
        <View style={styles.inputView}>
          <TextInput
            style={styles.textInput}
            value={password}
            placeholder="Password"
            secureTextEntry={true}
            onChangeText={(text) => setPassword(text)}
          />
        </View>
        <View style={styles.inputView}>
          <TextInput
            style={styles.textInput}
            value={handicap}
            placeholder="Handicap"
            keyboardType="numeric"
            onChangeText={(text) => setHandicap(text)}
          />
        </View>
        <TouchableOpacity
          style={styles.createUserButton}
          onPress={() => doUserRegistration()}
        >
          <Text style={styles.loginText}>Create User</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#282634",
  },
  createUserContainer: {
    marginVertical: 16,
    marginHorizontal: 8,
    backgroundColor: "#ff4057",
    marginVertical: 80,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    paddingVertical: 30,
    elevation: 4,
  },
  inputView: {
    backgroundColor: "#DCDCDC",
    borderRadius: 30,
    width: "60%",
    height: 45,
    marginBottom: 20,
    alignItems: "center",
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
    justifyContent: "center",
    fontSize: 20,
  },
  createUserButton: {
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
