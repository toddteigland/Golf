import React, { useEffect, useState } from "react";
import { Text, View, StyleSheet } from "react-native";
import Parse from "parse/react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";


// Parse.setAsyncStorage(AsyncStorage);
// Parse.initialize(
//   "0dyjfXKItbkSKG2YaOxFtUAxkhY98oL3pNd8eSzs",
//   "j8PP6pYFYQ3SBZZCOuUDj2ZGO2zUnlTRRvkjMiUX"
// );
// Parse.serverURL = "https://parseapi.back4app.com/";

export default function HelloUser({username})  {
  // State variables that will hold username and handicap values
  // const [username, setUsername] = useState("");
  // const [handicap, setHandicap] = useState(0);

  return (

      <View style={styles.container}>
          <Text style={styles.username} >
            `Hello {username}`
          </Text>
      </View>

  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 2,
    left: 0,
    backgroundColor: "#fff",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
    elevation: 4,
  },
  username: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#333",
  },
});
