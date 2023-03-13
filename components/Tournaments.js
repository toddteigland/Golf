import React, { useState, useEffect, useContext } from "react";
import { View, Text, Button, Alert, FlatList, StyleSheet } from "react-native";
import Parse from "parse/react-native";
import { TournamentContext } from "./context/TournamentContext";

export default function TournamentList() {
  const [tournaments, setTournaments] = useState([]);
  const { myTournaments, setMyTournaments } = useContext(TournamentContext);

  useEffect(() => {
    async function fetchTournaments() {
      const Tournaments = Parse.Object.extend("Tournaments");
      const query = new Parse.Query(Tournaments);
      const results = await query.find();
      setTournaments(results);
    }
    fetchTournaments();
  }, []);

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

  async function enterTournament(tournament) {
    const user = await Parse.User.currentAsync();
    const relation = tournament.relation("players");
    relation.add(user);
    tournament.save().then(
      () => {
        fetchMyTournaments()
        Alert.alert("Success", "You have entered the tournament.");
      },
      (error) => {
        console.error(error);
      }
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={[styles.headerCell, { flex: 0.7 }]}>Name</Text>
        <Text style={[styles.headerCell, { flex: 0.7 }]}>Rounds</Text>
        <Text style={[styles.headerCell, { flex: 0.7 }]}>Date</Text>
        <Text style={[styles.headerCell, { flex: 0.4 }]}>Register</Text>

      </View>
      <FlatList
        data={tournaments}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <Text style={[styles.cell, { flex: 0.7 }]}>{item.get("name") +""}</Text>
            <Text style={[styles.cell, { flex: 0.7 }]}>{item.get("rounds") +""}</Text>
            {/* <Text style={[styles.cell, { flex: 0.7 }]}>{item.get("startDate")}</Text> */}

            <Button
              style={[styles.button, { flex: 0.3 }]}
              title="Register"
              onPress={() => enterTournament(item)}
            />
          </View>
        )}
      />
    </View>
  )
        };

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 16,
    paddingHorizontal: 8,
    backgroundColor: "#fff",
    borderRadius: 8,
    elevation: 4,
    marginTop: 20,
    marginBottom: 10,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#f2f2f2",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  headerCell: {
    flex: 0.7,
    textAlign: "left",
    fontWeight: "bold",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 0.5,
    borderBottomColor: "#333",
    marginBottom: 8,
  },
  cell: {
    flex: 0.7,
    textAlign: "left",
  },
  button: {
    backgroundColor: "#007AFF",
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
})
