import React, { useContext, useEffect, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Button,
  Alert,
} from "react-native";
import Parse from "parse/react-native";
import { useNavigation } from "@react-navigation/native";
import { AuthContext } from "./context/AuthContext";

export default function Profile() {
  const { username, setUsername } = useContext(AuthContext);
  const { handicap, setHandicap } = useContext(AuthContext);
  const [myTournaments, setMyTournaments] = useState([]);
  const navigation = useNavigation();

  const handleLogout = async function () {
    return await Parse.User.logOut()
    .then(async () => {
        const currentUser = await Parse.User.currentAsync();
        if (currentUser === null) {
          setUsername(null);
          setHandicap(null);
          console.log(`User ${username} Logged out`);
        }
        navigation.navigate("Home");
        return true;
      })
      .catch((error) => {
        console.log('Profile Error: ', error);
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
          setMyTournaments(results);
        },
        (error) => {
          console.error(error);
        }
      );
    }
    fetchMyTournaments();
  }, [ ]);

  async function deleteTournament(tournament) {
    const user = await Parse.User.currentAsync();
    const relation = tournament.relation("players");
    relation.remove(user);
    tournament.save().then(
      () => {
        Alert.alert("Success", "You have Deleted the tournament.");
      },
      (error) => {
        console.error(error);
      }
    );
  }

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
                onPress={() => startTournament(item)}
              />
              <Button
                style={[styles.button, { flex: 0.3 }]}
                title="Delete"
                onPress={() => deleteTournament(item)}
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
