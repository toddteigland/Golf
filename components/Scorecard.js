import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import Parse from "parse/react-native";
import { TournamentContext } from "./context/TournamentContext";

const Scorecard = ({teebox, course}) => {
  const [totalScore, setTotalScore] = useState(0);
  const [scores, setScores] = useState(Array(18).fill(0));
  const [front9Scores, setFront9Scores] = useState([]);
  const [front9Total, setFront9Total] = useState(0);
  const [front9OverUnder, setFront9OverUnder] = useState(0);
  const [back9Scores, setBack9Scores] = useState([]);
  const [back9Total, setBack9Total] = useState(0);
  const [back9OverUnder, setBack9OverUnder] = useState(0);
  const [overUnderPar, setOverUnderPar] = useState(0);
  const [canSubmit, setCanSubmit] = useState(false);
  const [yardages, setYardages] = useState([]);
  const [holes, setHoles] = useState([]);
  const [par, setPar] = useState([]);
  const [loading, setLoading] = useState(true);
  const { currentTournament } = useContext(TournamentContext);


  // Check if user already has a score for this round/tournament
  const queryExistingScore = async () => {
    const Score = Parse.Object.extend("scores");
    const existingScoreQuery = new Parse.Query(Score);
    existingScoreQuery.include("tournament", currentTournament);
    existingScoreQuery.include("user", Parse.User.current());
    existingScoreQuery.include("course", course);

  
    try {
      const existingScore = await existingScoreQuery.first();
      // console.log("EXISTING SCORE:: ", existingScore);
      return existingScore;
    } catch (error) {
      console.log("ERROR QUERYING EXISTING SCORE: ", error);
      return null;
    }
  };
  
  

  useEffect(() => {
    queryExistingScore();
    console.log('TEEBOX', teebox);
  }, [loading]);

  useEffect(() => {
    // const currentTeebox = teebox["teebox"];
    const Tee = Parse.Object.extend("Tee");
    const teeQuery = new Parse.Query(Tee);
    teeQuery.equalTo("name", Tee);
    teeQuery
      .first()
      .then((tee) => {
        const yardages = tee.get("hole_yardages");
        const holes = tee.get("holes");
        const par = tee.get("hole_par");
        setYardages(yardages);
        setHoles(holes);
        setPar(par);
      })
      .catch((error) => {
        console.log("SET TEE ERROR: ", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [teebox]);

  const handleScoreChange = (index, value) => {
    const newScores = [...scores];
    if (value === "") {
      newScores[index] = 0;
    } else {
      newScores[index] = parseInt(value);
    }
    setScores(newScores);
    let total = 0;
    let overUnder = 0;
    let front9Total = 0;
    let front9OverUnder = 0;
    let back9Total = 0;
    let back9OverUnder = 0;

    newScores.forEach((score, index) => {
      if (score > 0) {
        total += score || 0;
        overUnder += (score || 0) - par[index];
        if (index < 9) {
          front9Total += score || 0;
          front9OverUnder += (score || 0) - par[index];
        } else {
          back9Total += score || 0;
          back9OverUnder += (score || 0) - par[index];
        }
      }
    });
    setOverUnderPar(overUnder);
    setFront9Total(front9Total);
    setTotalScore(total);
    setFront9OverUnder(front9OverUnder);
    setBack9Total(back9Total);
    setBack9OverUnder(back9OverUnder);
  };

  // Sets front9 and back9 scores + totals
  useEffect(() => {
    setFront9Scores(scores.slice(0, 9));
    setBack9Scores(scores.slice(9, 18));
  }, [scores]);
  useEffect(() => {
    setFront9Total(front9Scores.reduce((total, score) => total + score, 0));
    setBack9Total(back9Scores.reduce((total, score) => total + score, 0));
  }, [front9Scores, back9Scores]);

  // Submits score to db after checking if possible
  const handleScoreSubmit = async () => {
    if (!canSubmit) {
      Alert.alert("Please enter a score for each hole!");
    } else if (teebox === null) {
      Alert.alert("Please choose a teebox")
    } else {
      const tournament = new Parse.Object("Tournaments");
      tournament.id = currentTournament;
      const user = Parse.User.current();
      const tee = await new Parse.Query("Tee")
        .equalTo("name", teebox["teebox"])
        .first();

      const existingScore = await queryExistingScore(
        tournament,
        user,
        course
      );
      if (existingScore) {
        Alert.alert("You have already entered a score for this round.");
        return;
      }

      // Submit new score
      const score = new Score();
      score.set("hole_scores", scores);
      score.set("tournament", tournament);
      score.set("user", user);
      score.set("tee", tee);
      score.set("course", course);
      try {
        await score.save();
        Alert.alert("Score entered!");
      } catch (error) {
        console.log("Error submitting score: ", error);
        Alert.alert("Error submitting score. Have you selected a tee?");
      }
    }
  };

  // Checks if any scores have a 0, if so, cannot submit score
  useEffect(() => {
    const hasZeroScore = scores.some((score) => score === 0);
    setCanSubmit(!hasZeroScore);
  }, [scores]);

  //Submit button border turns green when all scores are entered
  const getSubmitButtonStyle = () => {
    if (canSubmit && teebox !== null) {
      return {
        height: 45,
        borderColor: "green",
        borderWidth: 1,
        backgroundColor: "lightgray",
        borderRadius: 8,
        padding: 4,
        marginVertical: 8,
        justifyContent: "center",
        elevation: 4,
      };
    } else {
      return {
        height: 45,
        borderColor: "red",
        borderWidth: 1,
        backgroundColor: "lightgray",
        borderRadius: 8,
        padding: 4,
        marginVertical: 8,
        justifyContent: "center",
      };
    }
  };

  const getBorderStyle = (index) => {
    if (scores[index] && scores[index] < par[index]) {
      return {
        borderRadius: 50,
        borderColor: "black",
        borderWidth: 2,
      };
    } else if (scores[index] > par[index]) {
      return {
        borderRadius: 0,
        borderColor: "red",
        borderWidth: 2,
      };
    } else if (scores[index] === par[index]) {
      return {
        borderRadius: 0,
      }
    } else {
      return {
        borderRadius: 8,
        borderColor: "gray",
        borderWidth: 1,
      };
    }
  }; 
  
  if (loading) {
    return (
      <View>
        <Text>Loading Scorecard...</Text>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Hole</Text>
        <Text style={styles.headerText}>Par</Text>
        <Text style={styles.headerText}>Yards</Text>
        <Text style={[styles.headerText, styles.scoreText]}>Score</Text>
      </View>
      <ScrollView style={styles.list}>
        {holes.map((hole, index) => (
          <View key={index} style={styles.row}>
            <Text style={styles.holeNumber}>{hole}</Text>
            <Text style={styles.holePar}>{par[index]}</Text>
            <Text style={styles.holeYards}>{yardages[index]}</Text>
            <TextInput
              keyboardType= 'number-pad'
              onChangeText={(value) => handleScoreChange(index, value)}
              style={[getBorderStyle(index), { height: 40, padding: 10, textAlign: 'center' }]}
            />
          </View>
        ))}
      </ScrollView>
      <View style={styles.scorecardFooter}>
        <View style={styles.submitButton}>
          <TouchableOpacity
            style={getSubmitButtonStyle()}
            onPress={handleScoreSubmit}
          >
            <Text>Submit Score</Text>
          </TouchableOpacity>
        </View>

        <View>
          <Text style={{fontWeight: 'bold'}}>Front 9:</Text>
          <Text>
            {front9Total} ({front9OverUnder > 0 ? "+" : ""}
            {front9OverUnder})
          </Text>
        </View>

        <View>
          <Text style={{fontWeight: 'bold'}}>Back 9:</Text>
          <Text>
            {back9Total} ({back9OverUnder > 0 ? "+" : ""}
            {back9OverUnder})
          </Text>
        </View>

        <View style={styles.total}>
          <Text style={styles.totalText}>Total:</Text>
          <Text style={styles.totalText}>
            {totalScore} ({overUnderPar > 0 ? "+" : ""}
            {overUnderPar})
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    elevation: 4,
    backgroundColor: "#fff",
    borderColor: "grey",
    borderWidth: 2,
  },
  header: {
    flexDirection: "row",
    alignContent: "space-around",
    // justifyContent: "center",
    backgroundColor: "#DCDCDC",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 10,
    marginBottom: 8,
    // borderColor: 'red',
    // borderWidth: 1,
  },
  headerText: {
    flex: 0.6,
    // justifyContent: 'space-between',
    // textAlign: "center",
    fontWeight: "bold",
    // alignSelf: 'center',
    // borderColor: 'blue',
    // borderWidth: 1,
  },
  scoreText: {
    textAlign: "right",
    // paddingRight: 15,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 2,
    // borderColor: 'red',
    // borderWidth: 1,
  },
  rowText: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
    // borderColor: 'blue',
    // borderWidth: 1,
  },
  holeNumber: {
    fontSize: 16,
    fontWeight: "bold",
  },
  holePar: {
    fontSize: 16,
  },
  holeYards: {
    fontSize: 16,
  },
  holeHandicap: {
    fontSize: 16,
  },
  input: {
    width: 50,
    height: 40,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    paddingLeft: 8,
  },
  list: {
    // borderBottomColor: "red",
    // borderBottomWidth: 1,
  },
  scorecardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 4,
    alignItems: "center",
  },
  submitButton: {
    // height: '100%',
    // borderColor: 'gray',
    // borderWidth: 1,
    // backgroundColor: 'lightgray',
    // borderRadius: 8,
    // padding: 4,
    // marginVertical: 8,
  },
  total: {
    borderWidth: 1,
    borderColor: "red",
    borderRadius: 8,
    padding: 4,
    alignItems: "flex-end",
  },
  totalText: {
    fontWeight: "bold",
    fontSize: 18,
  },
});

export default Scorecard;
