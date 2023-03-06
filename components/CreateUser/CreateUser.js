import React, { useState } from "react";
import {
  View,
  TextInput,
  Text,
  Alert,
  Button,
  TouchableOpacity,
} from "react-native";
import Parse from "parse/react-native";
import { homeButtonStyles } from "../Buttons/buttonStyle";
import { createUserStyle } from "./createUserStyle";

export const CreateUser = ({ onUserCreated }) => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [handicap, setHandicap] = useState(0);

  const doUserRegistration = async function () {
    const emailValue = email;
    const usernameValue = username;
    const passwordValue = password;
    const HandicapValue = handicap;

    const addHandicap = async function () {
      let Handicap = Parse.Object.extend("Handicap");
      let handicap = new Handicap();
      handicap.set("Handicap", parseInt(HandicapValue));
      handicap.set("owner", Parse.User.current());
      try {
        const savedHandicap = await handicap.save();
        onUserCreated();
      } catch (error) {
        Alert.alert("Error Saving Handicap", error.message);
      }
    };

    return await Parse.User.signUp(usernameValue, passwordValue)
      .then(async (createdUser) => {
        Alert.alert(
          "Success!",
          `User ${createdUser.getUsername()} was successfully created!`
        );
        await addHandicap();
      })
      .catch((error) => {
        Alert.alert("Error!", error.message);
        console.log("ERROR: ", error);
      });
  };

  return (
    <View>
      <TextInput
        style={createUserStyle.textbox}
        value={email}
        placeholder="Email"
        onChangeText={(text) => setEmail(text)}
      />
      <TextInput
        style={createUserStyle.textbox}
        value={username}
        placeholder="Username"
        onChangeText={(text) => setUsername(text)}
      />
      <TextInput
        style={createUserStyle.textbox}
        value={password}
        placeholder="Password"
        secureTextEntry={true}
        onChangeText={(text) => setPassword(text)}
      />
      <TextInput
        style={createUserStyle.textbox}
        value={handicap}
        placeholder="Handicap"
        keyboardType="numeric"
        onChangeText={(text) => setHandicap(text)}
      />
      <Button
        style={homeButtonStyles.container}
        onPress={doUserRegistration}
        title={"Create User"}
      ></Button>
    </View>
  );
};
