import React, { useContext, useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { TournamentContext } from "./context/TournamentContext";
import Parse from "parse/react-native";
import { ScrollView } from "react-native-gesture-handler";
import { TouchableOpacity } from "react-native";

const Leaderboard = () => {
  const { currentTournament } = useContext(TournamentContext);
  const [players, setPlayers] = useState([]);
  // const [scores, setScores] = useState([]);
  const [queryResults, setQueryResults] = useState([]);
  const [selectedLeaderboard, setSelectedLeaderboard] = useState('scQ2spSAZK');

  const setLeaderboard = (button) => {
    setSelectedLeaderboard(button);
  }



  useEffect(() => {
    async function getPlayersScores() {
      const tournamentQuery = new Parse.Query("Tournaments");
      tournamentQuery.equalTo("name", "Sandbagger");
      const tournamentA = await tournamentQuery.first();

      const scoresQuery = new Parse.Query("scores");
      scoresQuery.equalTo("tournament", tournamentA);
      scoresQuery.equalTo('course', selectedLeaderboard)
      
      try {
        const results = await scoresQuery.find();
        setQueryResults(results);

        const playersPromises = results.map(async (result) => {
          await result.get("user").fetch(); // fetch the full user object
          const player = result.get("user");
          return player;
        });

        const players = await Promise.all(playersPromises);
        setPlayers(players);
        queryResults.map((scores) => {});
        return true;
      } catch (error) {
        console.log("QUERY ERROR::", error);
        return false;
      }
    }
    getPlayersScores();
  }, [selectedLeaderboard]);

  if (queryResults.length === 0) {
    <Text>Loading leaderboard...</Text>;
  } else {
    
    return (
      <View>
        <View style={styles.leaderboards}>
          <TouchableOpacity style={[styles.roundButtons, selectedLeaderboard === 'scQ2spSAZK' && styles.selectedButton]} onPress={() => setLeaderboard('scQ2spSAZK')}>
            <Text>Round 1</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.roundButtons, selectedLeaderboard === 'BruPe84n5T' && styles.selectedButton]} onPress={() => setLeaderboard('BruPe84n5T')}>
            <Text>Round 2</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.roundButtons, selectedLeaderboard === 'V48QyvQUdh' && styles.selectedButton]} onPress={() => setLeaderboard('V48QyvQUdh')}>
            <Text>Round 3</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.roundButtons, selectedLeaderboard === '4' && styles.selectedButton]} onPress={() => setLeaderboard(4)}>
            <Text>Final</Text>
          </TouchableOpacity>
        </View>

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

            {/* <View style={styles.row}>
              <Text>Par</Text>
            </View> */}

            {queryResults
              .sort(
                (b, a) =>
                  b.get("hole_scores").reduce((acc, score) => acc + score, 0) -
                  a.get("hole_scores").reduce((acc, score) => acc + score, 0)
              ) // Sort players by descending totalScore
              .map((player) => {
                const scores = player.get("hole_scores") || []; // Ensure that scores is an array
                const totalScore = player
                  .get("hole_scores")
                  .reduce((acc, score) => acc + score, 0); // Calculate total score using reduce

                return (
                  <View style={styles.row}>
                    <View
                      style={styles.nameColumn}
                      key={player.get("user").get("username")}
                    >
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
                      <Text style={[styles.score, styles.total]}>
                        {totalScore}
                      </Text>
                    </View>
                  </View>
                );
              })}
          </View>
        </ScrollView>
      </View>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "flex-start",
    margin: 10,
    maxWidth: "auto",
    minHeight: 600,
  },
  leaderboards: {
    borderColor: "gray",
    borderWidth: 2,
    flexDirection: "row",
    justifyContent: "space-around",
  },
  roundButtons: {
    borderColor: "pink",
    borderWidth: 1,
    width: "15%",
    paddingVertical: 4,
    marginVertical: 8,
    alignItems: "center",
    borderRadius: 8,
    
  },
  selectedButton: {
    backgroundColor: 'pink',
  },
  row: {
    flexDirection: "row",

    marginBottom: 10,
    borderBottomColor: "gray",
    borderBottomWidth: 1,
  },

  column: {
    flex: 1,
    borderRightWidth: 1,
    borderRightColor: "red",
    width: 35,
    alignContent: "center",
  },
  nameColumn: {
    width: 80,
    alignItems: "flex-start",
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
    alignSelf: "center",
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
    fontWeight: "bold",
    fontSize: 17,
  },
});

export default Leaderboard;
