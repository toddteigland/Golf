import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Button,
} from "react-native";
import Parse from "parse/react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";

export default function Profile({ props, route }) {
  const [username, setUsername] = useState("");
  const [handicap, setHandicap] = useState();
  const [myTournaments, setMyTournaments] = useState([]);
  const navigation = useNavigation();
  const currentUser = username;
  const setIsLoggedIn = route.params.setIsLoggedIn;

  useEffect(() => {
    async function getCurrentUser() {
      const query = new Parse.Query("User");
      const currentUser = await Parse.User.currentAsync();
      console.log("CURRENT USER FROM PROFILE USEEFFECT: ", currentUser);
      if (currentUser !== null) {
        const user = await query.get(currentUser);
        setUsername(currentUser.getUsername());
        setHandicap(user.get("handicap"));
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
        }
        AsyncStorage.setItem("keepLoggedIn", JSON.stringify(false));
        navigation.navigate("Home");
        return true;
      })
      .catch((error) => {
        console.log(error);
        return false;
      });
  };

  useEffect(() => {
    async function fetchMyTournaments() {
      const currentUser = await Parse.User.currentAsync();
      const query = new Parse.Query("Tournaments");
      query.equalTo("players", currentUser);
      query.find().then(
        (results) => {
          console.log("MY TOURNAMENTS:   ", results);
          setMyTournaments(results);
        },
        (error) => {
          console.error(error);
        }
      );
    }
    fetchMyTournaments();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.helloUsercontainer}>
        <Text style={styles.username}>
          Hello {username} ({handicap})
        </Text>
      </View>

      <View>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text>Logout</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.myTournaments}>
        <View style={styles.headerRow}>
          <Text style={[styles.headerCell, { flex: 0.7 }]}>Name</Text>
          <Text style={[styles.headerCell, { flex: 0.3 }]}>
            Enter Tournament
          </Text>
        </View>
        <FlatList
          data={myTournaments}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.row}>
              <Text style={[styles.cell, { flex: 0.7 }]}>
                {item.get("name")}
              </Text>
              <Button
                style={[styles.button, { flex: 0.3 }]}
                title="Start"
                onPress={() => enterTournament(item)}
              />
            </View>
          )}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#282634",
    minHeight: "100%",
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
    position: "relative",
    top: 2,
    right: 2,
    marginLeft: 325,
    width: "20%",
    // marginTop: 50,
    borderRadius: 8,
    backgroundColor: "white",
    padding: 8,
    alignItems: "center",
    elevation: 4,
  },
  myTournaments: {
    backgroundColor: '#DCDCDC',
    marginTop: 20,
    padding: 12,
  },
});
