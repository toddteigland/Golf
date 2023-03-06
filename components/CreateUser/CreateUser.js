import { View, Text, TextInput, Button, Alert } from "react-native";
import { createUserStyle } from "./createUserStyle";
import { homeButtonStyles } from "../Buttons/buttonStyle";
import { useState } from "react";
// import axios, { Axios } from "axios";
// import UploadImage from "../uploadImage";
import Parse from "parse/react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";

Parse.setAsyncStorage(AsyncStorage);
Parse.initialize(
  "0dyjfXKItbkSKG2YaOxFtUAxkhY98oL3pNd8eSzs",
  "j8PP6pYFYQ3SBZZCOuUDj2ZGO2zUnlTRRvkjMiUX"
);
Parse.serverURL = "https://parseapi.back4app.com/";

// import InitialsAvatar from 'react-initials-avatar';

export const CreateUser = () => {

  const navigation = useNavigation();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [handicap, setHandicap] = useState(0);
  
  const doUserRegistration = async function () {
    // Note that these values come from state variables that we've declared before
    const emailValue = email;
    const usernameValue = username;
    const passwordValue = password;
    const HandicapValue = handicap;
    
    const addHandicap = async function () {
      let Handicap = Parse.Object.extend('Handicap');
      let handicap = new Handicap();
      handicap.set('Handicap', parseInt(HandicapValue));
      handicap.set('owner', Parse.User.current());
      try {
        const savedHandicap = await handicap.save();
      } catch (error) {
        Alert.alert('Error Saving Handicap', error.message)
      }
    }
    // Since the signUp method returns a Promise, we need to call it using await
    return await Parse.User.signUp(usernameValue, passwordValue)
    .then((createdUser) => {
      // Parse.User.signUp returns the already created ParseUser object if successful
      Alert.alert(
        'Success!',
        `User ${createdUser.getUsername()} was successfully created!`,
        );
        addHandicap();
        Parse.User.logIn(usernameValue, passwordValue)
        .then(() => {
          // User is now logged in
          console.log('User logged in successfully!');
        })
        .catch((error) => {
          console.log('Error logging in:', error);
        });
        return true;
      })
      .catch((error) => {
        // signUp can fail if any parameter is blank or failed an uniqueness check on the server
        Alert.alert('Error!', error.message);
        console.log('ERROR: ', error)
        return false;
      });
  };


  return (
    <View style={createUserStyle.container}>
      <Text style={{ fontWeight: 'bold' }}>{"Please Enter your details"}</Text>
      <TextInput
        onChangeText={(text) => setEmail(text)}
        style={createUserStyle.textbox}
        placeholder={'Email'}
        value={email}
        secureTextEntry={false}
      />
      <TextInput
        onChangeText={(text) => setUsername(text)}
        style={createUserStyle.textbox}
        placeholder={'username'}
        value={username}
        secureTextEntry={false}
        autoCapitalize={"none"}
      />
      <TextInput
        onChangeText={(text) => setPassword(text)}
        style={createUserStyle.textbox}
        value={password}
        placeholder={"Password"}
        secureTextEntry
      />
      <Text style={{ fontWeight: 'bold' }}>
        {handicap
          ? `You are a ${handicap} handicap, (liar)`
          : "Enter Handicap (NO SANDBAGGING)"}
      </Text>
      <TextInput
        onChangeText={(text) => setHandicap(text)}
        style={createUserStyle.textbox}
        value={handicap}
        placeholder='0'
        secureTextEntry={false}
      />
      {/* <UploadImage /> */}
      {/* <InitialsAvatar name={name} /> */}
      <View style={homeButtonStyles.container}>
        <Button title="Sign Up" onPress={() => {doUserRegistration(); navigation.navigate('Home');}} />
      </View>
    </View>
  );
}
