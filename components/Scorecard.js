import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, ScrollView } from "react-native";
import { FlatList,  } from "react-native-gesture-handler";

const Scorecard = ({ holes, onScoreSubmit }) => {
  const [scores, setScores] = useState(
    Array.from({ length: holes }, (_, i) => ({
      hole: i + 1,
      score: "",
    }))
  );

  const handleScoreChange = (value, hole) => {
    setScores((prevScores) =>
      prevScores.map((score) => {
        if (score.hole === hole) {
          return {
            ...score,
            score: value,
          };
        }

        return score;
      })
    );
  };

  const handleSubmit = () => {
    // Calculate total score
    const totalScore = scores.reduce(
      (acc, score) => acc + Number(score.score),
      0
    );

    // Call onScoreSubmit callback with total score and scores array
    onScoreSubmit(totalScore, scores);
  };

  return (
    <ScrollView style={styles.scrollview}>
      <View style={styles.table}>
        <View style={styles.hole}>
          <Text style={styles.headerText}>Hole</Text>
          {Array.from({ length: holes }, (_, i) => (
            <Text key={i} style={styles.headerText}>
              {i + 1}
            </Text>
          ))}
        </View>
        <View style={styles.par}>
        <Text style={styles.label}>Par</Text>

        </View>
        <View style={styles.par}>
        <Text style={styles.label}>Yrds</Text>

        </View>
        <View style={styles.par}>
        <Text style={styles.label}>Handicap</Text>

        </View>
        <View style={styles.score}>
          <Text style={styles.label}>Score</Text>
          {scores.map((score) => (
            <TextInput
              key={score.hole}
              style={styles.input}
              keyboardType="number-pad"
              value={score.score}
              onChangeText={(value) => handleScoreChange(value, score.hole)}
            />
          ))}
        </View>
      </View>
      <View>
        <Button title="Submit Score" onPress={handleSubmit} />
      </View>
      <View style={{height: 50}} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollview: {
    height: 500,
  },  
  table: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 8,
    elevation: 4,
    borderColor: "goldenrod",
    borderWidth: 3,
    minHeight: 600,
  },
  hole: {
    flexDirection: "column",
    justifyContent: "space-between",
    paddingVertical: 10,
    paddingHorizontal: 5,
    backgroundColor: "#eee",
  },
  score: {
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 5,
    borderColor: "black",
    borderWidth: 1,
  },
  par: {
    flexDirection: 'column',
    justifyContent: "space-between",
    paddingVertical: 10,
    paddingHorizontal: 5,
    backgroundColor: "#eee",
    borderColor: 'black',
    borderWidth: 1,
  },
  headerText: {
    fontWeight: "bold",
    fontSize: 18,
    textAlign: "center",
  },
  label: {
    fontWeight: "bold",
    fontSize: 18,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 5,
    width: 50,
    textAlign: "center",
  },
});

export default Scorecard;

// const Leaderboard = ({ players }) => {
//   const [loaded, setLoaded] = useState(false);
//   const [error, setError] = useState(null);
//   const [players, setPlayers] = useState([]);

//   useEffect(() => {
//     async function fetchPlayers() {
//       try {
//         const response = await fetch('https://api.example.com/players');
//         const data = await response.json();
//         setPlayers(data);
//         setLoaded(true);
//       } catch (error) {
//         setError(error);
//         setLoaded(true);
//       }
//     }

//     fetchPlayers();
//   }, []);

//   if (!loaded) {
//     return (
//       <View style={styles.container}>
//         <Text>Loading players...</Text>
//       </View>
//     );
//   }

//   if (error) {
//     return (
//       <View style={styles.container}>
//         <Text>Error loading players: {error.message}</Text>
//       </View>
//     );
//   }

//   if (players.length === 0) {
//     return (
//       <View style={styles.container}>
//         <Text>No players found</Text>
//       </View>
//     );
//   }

//   const sortedPlayers = players.sort((a, b) => a.totalScore - b.totalScore);

//   return (
//     <View style={styles.container}>
//       <View style={styles.header}>
//         <Text style={styles.headerText}>Leaderboard</Text>
//       </View>
//       <ScrollView style={styles.scrollView}>
//         {sortedPlayers.map((player, index) => (
//           <View style={styles.row} key={player.id}>
//             <Text style={styles.label}>{index + 1}</Text>
//             <Text style={styles.label}>{player.name}</Text>
//             <Text style={styles.label}>{player.totalScore}</Text>
//           </View>
//         ))}
//       </ScrollView>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#fff",
//     padding: 20,
//   },
//   header: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     marginBottom: 20,
//   },
//   headerText: {
//     fontSize: 24,
//     fontWeight: "bold",
//   },
//   scrollView: {
//     flex: 1,
//   },
//   row: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     marginBottom: 10,
//   },
//   label: {
//     fontSize: 18,
//     fontWeight: "bold",
//   },
//   input: {
//     fontSize: 18,
//     borderBottomWidth: 1,
//     borderColor: "#ccc",
//     padding: 5,
//     textAlign: "center",
//   },
// });

// export { Scorecard };
