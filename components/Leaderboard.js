import React, { useContext, useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { TournamentContext } from "./context/TournamentContext";
import Parse from "parse/react-native";

const Leaderboard = () => {
  const { myTournaments } = useContext(TournamentContext);
  const [players, setPlayers] = useState([]);

  // useEffect(() => {
  //   async function getPlayers() {
  //     const players = [];
  //     const tournament = myTournaments[0];
  //     const playerRelation = tournament.relation("players");
  //     const playerQuery = playerRelation.query();
  //     playerQuery.include("scorecard");
  //     const results = await playerQuery.find();
  //     for (let player of results) {
  //       const scorecard = player.get("scorecard");
  //       const holeScores = [];
  //       for (let i = 1; i <= 18; i++) {
  //         holeScores.push(scorecard.get(`hole${i}`));
  //       }
  //       const totalScore = holeScores.reduce(
  //         (accumulator, currentScore) => accumulator + currentScore,
  //         0
  //       );
  //       players.push({
  //         name: player.get("username"),
  //         holeScores: holeScores,
  //         totalScore: totalScore,
  //       });
  //     }
  //     players.sort((a, b) => a.totalScore - b.totalScore);
  //     setPlayers(players);
  //   }
  //   if (myTournaments.length > 0) {
  //     getPlayers();
  //   }
  // }, [myTournaments]);

  // if (players.length === 0) {
  //   return <Text>Loading leaderboard...</Text>;
  // }

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <View style={styles.column}>
          <Text style={styles.header}>Player</Text>
        </View>
        {[...Array(18)].map((_, i) => (
          <View style={styles.column} key={`hole${i + 1}`}>
            <Text style={styles.header}>{i + 1}</Text>
          </View>
        ))}
        <View style={styles.column}>
          <Text style={styles.header}>Total</Text>
        </View>
      </View>
      {players.map((player) => (
        <View style={styles.row} key={player.name}>
          <View style={styles.column}>
            <Text style={styles.playerName}>{player.name}</Text>
          </View>
          {player.holeScores.map((score, index) => (
            <View style={styles.column} key={`score${index}`}>
              <Text style={styles.score}>{score}</Text>
            </View>
          ))}
          <View style={styles.column}>
            <Text style={styles.score}>{player.totalScore}</Text>
          </View>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "stretch",
    margin: 10,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  column: {
    flex: 1,
    alignItems: "center",
  },
  header: {
    fontWeight: "bold",
    fontSize: 16,
  },
  playerName: {
    fontWeight: "bold",
    fontSize: 16,
    marginRight: 10,
  },
})

export default Leaderboard;