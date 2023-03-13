import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  ScrollView,
  FlatList
} from "react-native";
// import { FlatList,  } from "react-native-gesture-handler";
// const Scorecard = ({ holes, onScoreSubmit }) => {

const Scorecard = () => {

  const holes = [
    { number: 1, par: 4, yards: 350, handicap: 5 },
    { number: 2, par: 5, yards: 520, handicap: 7 },
    { number: 3, par: 3, yards: 160, handicap: 15 },
    { number: 4, par: 4, yards: 350, handicap: 4 },
    { number: 5, par: 4, yards: 350, handicap: 16 },
    { number: 6, par: 3, yards: 160, handicap: 11 },
    { number: 7, par: 5, yards: 520, handicap: 10 },
    { number: 8, par: 4, yards: 350, handicap: 9 },
    { number: 9, par: 4, yards: 350, handicap: 1 },
    { number: 10, par: 5, yards: 520, handicap: 2 },
    { number: 11, par: 4, yards: 350, handicap: 8 },
    { number: 12, par: 4, yards: 350, handicap: 17 },
    { number: 13, par: 5, yards: 520, handicap: 14 },
    { number: 14, par: 4, yards: 350, handicap: 6 },
    { number: 15, par: 5, yards: 520, handicap: 3 },
    { number: 16, par: 3, yards: 160, handicap: 12 },
    { number: 17, par: 4, yards: 350, handicap: 13 },
    { number: 18, par: 3, yards: 160, handicap: 18 },
  ];

  const [totalScore, setTotalScore] = useState(0);
  const [scores, setScores] = useState(holes.map(hole => ({ score: null })));


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


return (
  <View style={styles.container}>
    <View style={styles.header}>
      <Text style={styles.headerText}>Hole</Text>
      <Text style={styles.headerText}>Par</Text>
      <Text style={styles.headerText}>Yards</Text>
      <Text style={styles.headerText}>Handicap</Text>
      <Text style={styles.headerText}>Score</Text>
    </View>
    <FlatList
      data={holes}
      renderItem={({ item }) => (
        <View style={styles.row}>
          <Text style={styles.rowText}>{item.number}</Text>
          <Text style={styles.rowText}>{item.par}</Text>
          <Text style={styles.rowText}>{item.yards}</Text>
          <Text style={styles.rowText}>{item.handicap}</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            onChangeText={(value) => handleScoreChange(item.number, value)}
          />
        </View>
      )}
      keyExtractor={(item) => item.number.toString()}
      style={styles.list}
    />
    <View style={styles.total}>
      <Text style={styles.totalText}>Total:</Text>
      <Text style={styles.totalText}>{totalScore}</Text>
    </View>
  </View>
);
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    elevation: 4,
    backgroundColor: "#fff",

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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',

  },  
  rowText: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  total: {
    alignContent: 'flex-end',
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
});
export default Scorecard;
