import React, { useEffect, useState } from "react";
import { Text, View, StyleSheet, TouchableOpacity } from "react-native";
import Parse from "parse/react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";

export default function Profile({ props, route }) {
  const [username, setUsername] = useState('');
  const navigation = useNavigation();
  const currentUser = username;
  const setIsLoggedIn = route.params.setIsLoggedIn;

  useEffect(() => {
    // Since the async method Parse.User.currentAsync is needed to
    // retrieve the current user data, you need to declare an async
    // function here and call it afterwards
    async function getCurrentUser() {
      // This condition ensures that username is updated only if needed
      // if (username === '') {
        const currentUser = await Parse.User.currentAsync();
        console.log('CURRENT USER FROM PROFILE USEEFFECT: ', currentUser);
        if (currentUser !== null) {
          setUsername(currentUser.getUsername());
        }
      }
      getCurrentUser();
    }, []);
    
    const handleLogout = async function () {
      return await Parse.User.logOut()
      .then(async () => {
        const currentUser = await Parse.User.currentAsync();
        if (currentUser === null) {
          console.log(`User ${username} Logged out`);
          setIsLoggedIn(false);
          // props.toggleLoggedIn(false);
        }
        AsyncStorage.setItem('keepLoggedIn', JSON.stringify(false));
        navigation.navigate("Home");
        return true;
      })
      .catch((error) => {
        console.log(error);
        return false;
      });
  };

  return (
    <View style={styles.container}>
      {/* {!currentUser ? ( */}
        <View style={styles.helloUsercontainer}>
          <Text style={styles.username}>Hello {username}</Text>
        </View>
        <View>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
              <Text>Logout</Text>
            </TouchableOpacity>
        </View>
      {/* ) : (
        <View>
          <Text>Please Log in</Text>
        </View>
      )} */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#282634',
    minHeight: '100%',
  },
  helloUsercontainer: {
    position: "absolute",
    top: 2,
    left: 2,
    backgroundColor: "#fff",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    elevation: 4,
  },
  username: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#333",
  },
  logoutButton: {
    position: 'relative',
    top: 2,
    right: 2,
    marginLeft: 325,
    width: '20%',
    // marginTop: 50,
    borderRadius: 8,
    backgroundColor: 'white',
    padding: 8,
    alignItems: 'center',
    elevation: 4,
  },
});
