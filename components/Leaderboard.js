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
  const [selectedLeaderboard, setSelectedLeaderboard] = useState("scQ2spSAZK");
  const [scoresByUserAndCourse, setScoresByUserAndCourse] = useState({});
  const [loading, setLoading] = useState(true);

  const setLeaderboard = (button) => {
    setSelectedLeaderboard(button);
  };

  async function getPlayersScores() {
    const tournamentQuery = new Parse.Query("Tournaments");
    tournamentQuery.equalTo("name", "Sandbagger");
    const tournamentA = await tournamentQuery.first();
    const scoresQuery = new Parse.Query("scores");
    scoresQuery.equalTo("tournament", tournamentA);
    scoresQuery.equalTo("course", selectedLeaderboard);
    try {
      const results = await scoresQuery.find();
      setQueryResults(results);
      const playersPromises = results.map(async (result) => {
        await result.get("user").fetch();
        const player = result.get("user");
        return player;
      });
      const players = await Promise.all(playersPromises);
      setPlayers(players);
      queryResults.map((scores) => {});
      setLoading(false);
      return true;
    } catch (error) {
      console.log("PLAYER SCORE QUERY ERROR::", error);
      return false;
    }
  }

  async function gettotalScores() {
    const tournamentQuery = new Parse.Query("Tournaments");
    tournamentQuery.equalTo("name", "Sandbagger");
    const tournamentA = await tournamentQuery.first();
    const scoresQuery = new Parse.Query("scores");
    scoresQuery.equalTo("tournament", tournamentA);

    try {
      const results = await scoresQuery.find();
      setQueryResults(results);

      const newScoresByUserAndCourse = {};
      results.forEach((score) => {
        const user = score.get("user");
        const courseId = score.get("course").id;
        if (!newScoresByUserAndCourse[user.id]) {
          newScoresByUserAndCourse[user.id] = {};
        }
        if (!newScoresByUserAndCourse[user.id][courseId]) {
          newScoresByUserAndCourse[user.id][courseId] = {
            total: 0,
            holes: [],
          };
        }
        const holeScores = score.get("hole_scores");
        const totalScore = holeScores.reduce((acc, curr) => acc + curr, 0);
        newScoresByUserAndCourse[user.id][courseId].holes.push(...holeScores);
        newScoresByUserAndCourse[user.id][courseId].total += totalScore;
      });

      setScoresByUserAndCourse(newScoresByUserAndCourse);

      const players = Object.keys(scoresByUserAndCourse).map((userId) => {
        const score = results.find((score) => score.get("user").id === userId);
        const courseId = score.get("course").id;
        return {
          id: userId,
          name: score.get("user").get("username"),
          scores: score.get("hole_scores"),
          total: scoresByUserAndCourse[userId][courseId].total,
        };
      });
      setPlayers(players);
      setLoading(false);
      return scoresByUserAndCourse;
    } catch (error) {
      console.log("TOTAL SCORE QUERY ERROR:", error);
      return false;
    }
  }

  useEffect(() => {
    if (selectedLeaderboard !== "final") {
      getPlayersScores();
    } else {
      gettotalScores();
    }
  }, [selectedLeaderboard]);

  if (loading) {
    return (
      <View>
        <Text>Loading leaderboard...</Text>
      </View>
    );
  } else {
    return (
      <View>
        <View style={styles.leaderboards}>
          <TouchableOpacity
            style={[
              styles.roundButtons,
              selectedLeaderboard === "scQ2spSAZK" && styles.selectedButton,
            ]}
            onPress={() => setLeaderboard("scQ2spSAZK")}
          >
            <Text>Round 1</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.roundButtons,
              selectedLeaderboard === "BruPe84n5T" && styles.selectedButton,
            ]}
            onPress={() => setLeaderboard("BruPe84n5T")}
          >
            <Text>Round 2</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.roundButtons,
              selectedLeaderboard === "V48QyvQUdh" && styles.selectedButton,
            ]}
            onPress={() => setLeaderboard("V48QyvQUdh")}
          >
            <Text>Round 3</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.roundButtons,
              selectedLeaderboard === "final" && styles.selectedButton,
            ]}
            onPress={() => setLeaderboard("final")}
          >
            <Text>Final</Text>
          </TouchableOpacity>
        </View>

        {selectedLeaderboard === "final" ? (
          <View>
            <View style={styles.finalContainer}>
              <View style={[styles.row, styles.headerRow]}>
                <View style={styles.nameColumn}>
                  <Text style={styles.playerName}>Player</Text>
                </View>
                <View style={styles.finalColumns}>
                  <Text style={styles.header}>Tobiano</Text>
                </View>
                <View style={styles.finalColumns}>
                  <Text style={styles.header}>Big Horn</Text>
                </View>
                <View style={styles.finalColumns}>
                  <Text style={styles.header}>Dune</Text>
                </View>
                <View style={styles.finalColumns}>
                  <Text style={styles.header}>Total</Text>
                </View>
              </View>

              {players
                .sort((b, a) => {
                  const playerAScores = scoresByUserAndCourse[a.id] || {};
                  const playerBScores = scoresByUserAndCourse[b.id] || {};

                  const playerATobianoScore = playerAScores["scQ2spSAZK"]?.total || 0;
                  const playerABigHornScore = playerAScores["BruPe84n5T"]?.total || 0;
                  const playerADuneScore = playerAScores["V48QyvQUdh"]?.total || 0;
                  const playerATotalScore = playerATobianoScore + playerABigHornScore + playerADuneScore;
                  const playerBTobianoScore = playerBScores["scQ2spSAZK"]?.total || 0;
                  const playerBBigHornScore = playerBScores["BruPe84n5T"]?.total || 0;
                  const playerBDuneScore = playerBScores["V48QyvQUdh"]?.total || 0;
                  const playerBTotalScore = playerBTobianoScore + playerBBigHornScore + playerBDuneScore;
                  return playerBTotalScore - playerATotalScore;
                })
                .map((player) => {
                  const playerScores = scoresByUserAndCourse[player.id] || {};
                  const tobianoScore = playerScores["scQ2spSAZK"]?.total || 0;
                  const bigHornScore = playerScores["BruPe84n5T"]?.total || 0;
                  const duneScore = playerScores["V48QyvQUdh"]?.total || 0;
                  const totalScore = tobianoScore + bigHornScore + duneScore;
                  return (
                    <View
                      key={player.objectId}
                      style={[styles.row, styles.scoreRow]}
                    >
                      <View style={styles.nameColumn}>
                        <Text style={styles.playerName}>{player.name}</Text>
                      </View>
                      <View style={styles.finalColumns}>
                        <Text style={styles.score}>{tobianoScore}</Text>
                      </View>
                      <View style={styles.finalColumns}>
                        <Text style={styles.score}>{bigHornScore}</Text>
                      </View>
                      <View style={styles.finalColumns}>
                        <Text style={styles.score}>{duneScore}</Text>
                      </View>
                      <View style={styles.finalColumns}>
                        <Text style={styles.score}>{totalScore}</Text>
                      </View>
                    </View>
                  );
                })}
            </View>
          </View>
        ) : (
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
                    b
                      .get("hole_scores")
                      .reduce((acc, score) => acc + score, 0) -
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
        )}
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
  finalContainer: {
    width: "100%",
    margin: 4,
  },
  finalColumns: {
    width: 80,
    borderRightWidth: 1,
    borderRightColor: "red",
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
    backgroundColor: "pink",
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
    // width: 50,
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
