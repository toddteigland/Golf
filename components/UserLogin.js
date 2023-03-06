import React, {useState} from 'react';
import {
  TextInput,
  TouchableOpacity,
  View,
  Button,
  Alert
} from 'react-native';
import Parse from 'parse/react-native';
import { createUserStyle } from "./CreateUser/createUserStyle";
import {useNavigation} from '@react-navigation/native';
import { HelloUser } from './HelloUser';
import { homeButtonStyles } from './Buttons/buttonStyle';


export const UserLogin = () => {

  const navigation = useNavigation();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const doUserLogIn = async function () {
    // Note that these values come from state variables that we've declared before
    const usernameValue = username;
    const passwordValue = password;
    console.log('usernameValue:', usernameValue);
    return await Parse.User.logIn(usernameValue, passwordValue)
      .then(async (loggedInUser) => {
        // logIn returns the corresponding ParseUser object
        // To verify that this is in fact the current user, currentAsync can be used
        const currentUser = await Parse.User.currentAsync();
        setIsLoggedIn(true);
        console.log(loggedInUser === currentUser);
        navigation.navigate('Home');
        return true;
      })
      .catch((error) => {
        // Error can be caused by wrong parameters or lack of Internet connection
        Alert.alert('Error!', error.message);
        console.log('LOGIN ERROR: ', error.message)
        setIsLoggedIn(false);
        return false;
      });
  };

  const doUserLogOut = async function () {
    return await Parse.User.logOut()
      .then(async () => {
        // To verify that current user is now empty, currentAsync can be used
        const currentUser = await Parse.User.currentAsync();
        if (currentUser === null) {
        }
        setIsLoggedIn(false);
        // Navigation dispatch calls a navigation action, and popToTop will take
        // the user back to the very first screen of the stack
        return true;
      })
      .catch((error) => {
        Alert.alert('Error!', error.message);
        return false;
      });
  };

  return (
      <View>
        <TouchableOpacity>
          <View >
            {!isLoggedIn ?
              <View>
              <TextInput
                style={createUserStyle.textbox}
                value={username}
                placeholder={'Username'}
                onChangeText={(text) => setUsername(text)}
                autoCapitalize={'none'}
                keyboardType={'email-address'}
              />
              <TextInput
                style={createUserStyle.textbox}
                value={password}
                placeholder={'Password'}
                secureTextEntry
                onChangeText={(text) => setPassword(text)}
              />
              <Button 
              title= 'Log in'
              onPress={doUserLogIn}
              >
              </Button>
                </View>
               :
              <View>
                <HelloUser />
                <Button 
                  style={homeButtonStyles.button} 
                  title='Logout'
                  onPress={doUserLogOut}
                ></Button>
              </View>
              }
          </View>
        </TouchableOpacity>
      </View>
  );
};