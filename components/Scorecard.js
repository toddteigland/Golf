import React, { useState, useContext, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  ScrollView,
  FlatList,
  LogBox,
} from "react-native";
import { TournamentContext } from "./context/TournamentContext";
import Parse from "parse/react-native";

// import { FlatList,  } from "react-native-gesture-handler";
// const Scorecard = ({ holes, onScoreSubmit }) => {

const Scorecard = (teebox) => {
  const [totalScore, setTotalScore] = useState(0);
  // const { teebox, setteebox } = useContext(TournamentContext);
  const [yardages, setYardages] = useState([]);
  const [holes, setHoles] = useState([]);
  const [par, setPar] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    teebox = teebox['teebox'];
    const Tee = Parse.Object.extend("Tee");
    const teeQuery = new Parse.Query(Tee);
    teeQuery.equalTo("name", teebox);
    teeQuery.first()
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
    newScores[index].score = parseInt(value) || null;
    setScores(newScores);
    calculateTotalScore(newScores);
  };

  const calculateTotalScore = (newScores) => {
    let total = 0;
    newScores.forEach((score) => {
      total += score.score || 0;
    });
    setTotalScore(total);
  };

  if (loading) {
    return <Text>Loading...</Text>;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Hole</Text>
        <Text style={styles.headerText}>Par</Text>
        <Text style={styles.headerText}>Yards</Text>
        <Text style={styles.headerText}>Score</Text>
      </View>
      <ScrollView style={styles.list}>
        {holes.map((hole, index) => (
          <View key={index} style={styles.row}>
            <Text style={styles.holeNumber}>{index + 1}</Text>
            <Text style={styles.holePar}>{par[index]}</Text>
            <Text style={styles.holeYards}>{yardages[index]}</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              onChangeText={(value) => handleScoreChange(index, value)}
            />
          </View>
        ))}
      </ScrollView>
      <View style={styles.total}>
        <Text style={styles.totalText}>Total:</Text>
        <Text style={styles.totalText}>{totalScore}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    elevation: 4,
    backgroundColor: "#fff",
    borderColor: 'grey',
    borderWidth: 2,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#DCDCDC",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  headerText: {
    flex: 0.6,
    textAlign: "left",
    fontWeight: "bold",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  rowText: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  total: {
    alignContent: "flex-end",
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
    
  }
});

export default Scorecard;
