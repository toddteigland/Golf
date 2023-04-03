import React, { useContext, useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { TournamentContext } from "./context/TournamentContext";
import Parse from "parse/react-native";
import { ScrollView } from "react-native-gesture-handler";

const Leaderboard = () => {
  const { currentTournament } = useContext(TournamentContext);
  const [players, setPlayers] = useState([]);
  // const [scores, setScores] = useState([]);
  const [queryResults, setQueryResults] = useState([]);

  useEffect(() => {
    async function getPlayersScores() {
      const tournamentQuery = new Parse.Query("Tournaments");
      tournamentQuery.equalTo("name", "Sandbagger");
      const tournamentA = await tournamentQuery.first();

      const scoresQuery = new Parse.Query("scores");
      scoresQuery.equalTo("tournament", tournamentA);

      try {
        const results = await scoresQuery.find();
        setQueryResults(results);

        const playersPromises = results.map(async (result) => {
          await result.get("user").fetch(); // fetch the full user object
          // console.log("results", result.get("hole_scores"), "for user", result.get("user").get("username"), " at ", result.get("course"));
          const player = result.get("user");
          return player;
        });

        const players = await Promise.all(playersPromises);
        setPlayers(players);
        // console.log('PLAYERS', players);
        queryResults.map((scores) => {
          // console.log('QUERY RESULTS SCORES ::', scores.get('user'));
        });
        return true;
      } catch (error) {
        console.log("QUERY ERROR::", error);
        return false;
      }
    }
    getPlayersScores();
  }, [queryResults.length]);

  if (queryResults.length === 0) {
    <Text>Loading leaderboard...</Text>;
  } else {
    return (
      <ScrollView horizontal persistentScrollbar>
        <View style={styles.container}>
          <View style={[styles.row, styles.headerRow]}>
            <View style={styles.nameColumn}>
              <Text style={styles.playerName}>Player</Text>
            </View>
            {[...Array(18)].map((_, i) => (
              <View style={styles.column} key={`hole${i + 1}`}>
                <Text style={styles.header}>{i + 1}</Text>
              </View>
            ))}
            <View style={[styles.column, styles.totalColumn]}>
              <Text style={styles.header}>Total</Text>
            </View>
          </View>

          {queryResults
            .sort(
              (b, a) =>
                b.get("hole_scores").reduce((acc, score) => acc + score, 0) -
                a.get("hole_scores").reduce((acc, score) => acc + score, 0)
            ) // Sort players by descending totalScore
            .map((player) => {
              // console.log("QUERY RESULTS - PLAYER::", player);
              const scores = player.get("hole_scores") || []; // Ensure that scores is an array
              // console.log("SCORES", scores);
              const totalScore = player
                .get("hole_scores")
                .reduce((acc, score) => acc + score, 0); // Calculate total score using reduce

              return (
                <View
                  style={styles.row}
                  key={player.get("user").get("username")}
                >
                  <View style={styles.nameColumn}>
                    <Text style={styles.playerName}>
                      {player.get("user").get("username")}
                    </Text>
                  </View>
                  {scores.map((score, index) => (
                    <View style={styles.column} key={`hole${index + 1}`}>
                      <Text style={styles.score}>{score}</Text>
                    </View>
                  ))}
                  <View style={styles.totalColumn}>
                    <Text style={[styles.score, styles.total]}>{totalScore}</Text>
                  </View>
                </View>
              );
            })}
        </View>
      </ScrollView>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "flex-start",
    margin: 10,
    maxWidth: 'auto',
    
  },
  row: {
    flexDirection: "row",
    // alignItems: "center",
    // justifyContent: "space-between",
    marginBottom: 10,
    borderBottomColor: "gray",
    borderBottomWidth: 1,
  },

  column: {
    flex: 1,
    // textAlign: 'center',
    borderRightWidth: 1,
    borderRightColor: "red",
    // paddingRight: 2,
    width: 35,
    alignContent: "center",
    // paddingRight: 4
  },
  nameColumn: {
    width: 80,
    alignItems: 'flex-start',
    borderRightWidth: 1,
    borderRightColor: "red",
  },
  totalColumn: {
    // position: 'absolute',
    // left: 370,
    // zIndex: 1,
    width: 50,
    borderRightWidth: 1,
    borderRightColor: "red",
},
  header: {
    fontWeight: "bold",
    fontSize: 18,
    width: 50,
    // justifyContent: 'space-between',
    textAlign: "center",
    alignSelf: 'center',
  },
  headerRow: {
    marginBottom: 15,
  },  
  playerName: {
    flex: 1,
    fontWeight: "bold",
    fontSize: 16,
    textAlign: "center",
    // marginRight: 2,
    // flexShrink: 1,
    // flexWrap: 'nowrap'
    maxWidth: 150,
  },
  score: {
    alignSelf: "center",
  },
  total: {
    fontWeight: 'bold',
    fontSize: 17,
  },
});

export default Leaderboard;
