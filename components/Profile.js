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
import { TournamentContext } from "./context/TournamentContext";
// import { fetchMyTournaments } from "./helpers/fetchMyTournaments";

export default function Profile() {
  const { username, setUsername } = useContext(AuthContext);
  const { handicap, setHandicap } = useContext(AuthContext);
  const { currentTournament, setCurrentTournament } = useContext(TournamentContext);
  const { myTournaments, setMyTournaments } = useContext(TournamentContext);
  const { teebox, setTeebox } = useContext(TournamentContext);
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
        console.log("Profile Error: ", error);
        return false;
      });
  };

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

  function startTournament(tournament) {
    setCurrentTournament(tournament)
    // showAlert();
    navigation.navigate('Play Sandbagger');
  }


  async function deleteTournament(tournament) {
    const user = await Parse.User.currentAsync();
    const relation = tournament.relation("players");
    relation.remove(user);
    tournament.save().then(
      () => {
        fetchMyTournaments();
        Alert.alert("Success", "You have Left the tournament.");
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

      <View style={styles.myTournamentsContainer}>
        <View>
          <Text style={styles.Header}>My Tournaments </Text>
        </View>
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
              <Text style={[styles.name, { flex: 0.7 }]}>
                {item.get("name")}
              </Text>
              <TouchableOpacity
                style={[styles.button, { flex: 0.3 }]}
                onPress={() => startTournament(item)} >
                  <Text>Start</Text>
               </TouchableOpacity>

              <TouchableOpacity
                style={[styles.button, { flex: 0.3 }]}
                onPress={() => deleteTournament(item)}
              >
                <Text>Leave</Text>
              </TouchableOpacity>
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
  myTournamentsContainer: {
    backgroundColor: "#DCDCDC",
    marginTop: 20,
    padding: 12,
    gap: 5,
    borderRadius: 8,
  },
  Header: {
    justifyContent: "center",
    textAlign: "center",
    alignSelf: "center",
    paddingVertical: 5,
    fontSize: 18,
    // backgroundColor: 'green',
    width: "100%",
    borderRadius: 8,
    // elevation: 2,
  },
  headerRow: {
    backgroundColor: "#ff4057",
    minHeight: 50,
    flexDirection: "row",
    borderRadius: 8,
    paddingHorizontal: 4,
    alignItems: "center",
    fontWeight: "bold",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    height: 50,
    borderBottomWidth: 1,
    borderBottomColor: 'dark grey',
  },
  name: {
    alignSelf: "center",
    fontWeight: "bold",
  },
  button: {
    backgroundColor: "#ff4057",
    marginHorizontal: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 8,
    elevation: 8,
    borderRadius: 8,
  },
});
