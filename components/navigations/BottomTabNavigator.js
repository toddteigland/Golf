import React, { useContext, useEffect, useState } from "react";
import {
  Image,
  View,
  TouchableOpacity,
  Text,
  Alert,
  Modal,
} from "react-native";
import { TournamentContext } from "../context/TournamentContext";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Scorecard from "../Scorecard";
import Leaderboard from "../Leaderboard";
import Parse from "parse/react-native";

const icon1 = require("../../assets/icons/icon1.png");
const icon2 = require("../../assets/icons/icon2.png");
const icon3 = require("../../assets/icons/icon3.png");
const iconLeaderboard = require("../../assets/icons/iconLeaderboard.png");

const Tab = createBottomTabNavigator();

const BottomTabNavigator = ( {route} ) => {
  // const { teebox, setTeebox } = useContext(TournamentContext);
  const { round1teebox, setRound1Teebox } = useContext(TournamentContext);
  const { round2teebox, setRound2Teebox } = useContext(TournamentContext);
  const { round3teebox, setRound3Teebox } = useContext(TournamentContext);

  const [modalVisible, setModalVisible] = useState(false);
  const [teeboxOptions, setTeeboxOptions] = useState([]);
  // const [courseId, setCourseId] = ('');

  const handleTeeboxSelection = (routeName) => {
    setModalVisible(true);
    showAlert(routeName);
  };

  const showAlert = async (courseName) => {

    if (courseName == 'Tobiano') {
      courseId = 'scQ2spSAZK';
    }else if (courseName === 'Big Horn') {
      courseId = 'BruPe84n5T';
    }else if (courseName === 'Dune') {
      courseId = 'V48QyvQUdh';
    }

    const Tee = Parse.Object.extend("Tee");
    const query = new Parse.Query(Tee);
    query.equalTo("course", {
      __type: "Pointer",
      className: "Course",
      objectId: courseId,
    });
    try {
      const results = await query.find();
      const options = results.map((result) => ({
        text: `${result.get('name')} (${result.get('total_yardage')} yards)`,
        onPress: () => {
          if (courseName == 'Tobiano') {
            setRound1Teebox(result.get('name'));
          }else if (courseName === 'Big Horn') {
            setRound2Teebox(result.get('name'));
          }else if (courseName === 'Dune') {
            setRound3Teebox(result.get('name'));
          }
          setModalVisible(false);
        },
      }));

      setTeeboxOptions([
        ...options,
        { text: "Cancel", onPress: () => setModalVisible(false) },
      ]);
     } catch (error) {
      console.error(error);
    }
  };


  return (
    <View style={{ flex: 1 }}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
        }}
      >
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <View
            style={{
              backgroundColor: "#d7e9f7",
              borderRadius: 20,
              padding: 35,
              alignItems: "center",
              borderColor: 'gray',
              borderWidth: 1,
              elevation: 4,
            }}
          >
            <Text style={{ fontSize: 20, marginBottom: 20, fontWeight: 'bold', }}>
              Select Tee Box
            </Text>
            {teeboxOptions.map((option) => (
              <TouchableOpacity key={option.text} onPress={option.onPress}>
                <Text
                  style={{
                    fontSize: 16,
                    color: option.text === "Cancel" ? "red" : "black",
                    marginVertical: 10,
                  }}
                >
                  {option.text}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Modal>

      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerTitle: () => (
            <View style={{ flexDirection: "row", justifyContent: 'space-between',  minWidth: '100%' }}>
              <Text style={{ fontSize: 18 }}>{route.name}</Text>
              {route.name !== 'Leaderboard' && ( round1teebox || round2teebox || round3teebox ? (
                <TouchableOpacity
                  style={{  }}
                  onPress={() => handleTeeboxSelection(route.name)}
                >
                  <Text
                    style={{
                      fontSize: 16,
                      width:'auto',
                      borderColor: "grey",
                      borderWidth: 1,
                      borderRadius: 8,
                      padding: 5,
                    }}
                  >{route.name === "Tobiano" ? round1teebox : route.name === "Big Horn" ? round2teebox : round3teebox} tees</Text>

                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={{  }}
                  onPress={() => handleTeeboxSelection(route.name)}
                >
                  <Text
                    style={{
                      fontSize: 16,
                      borderColor: "grey",
                      borderWidth: 1,
                      borderRadius: 8,
                      padding: 5,
                      backgroundColor: "#ff4057",
                    }}
                  >
                    Select Tee
                  </Text>
                </TouchableOpacity>
              )
              )}
            </View>
          ),
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;
            if (route.name === "Tobiano") {
              iconName = icon1;
              // SetCourseId = 'scQ2spSAZK';
            } else if (route.name === "Big Horn") {
              iconName = icon2;
              // SetCourseId = 'BruPe84n5T'
            } else if (route.name === "Dune") {
              iconName = icon3;
              // SetCourseId = 'V48QyvQUdh'
            } else if (route.name === "Leaderboard") {
              iconName = iconLeaderboard;
            }
            return (
              <Image source={iconName} style={{ width: 25, height: 25 }} />
            );
          },
        })}
      >
        <Tab.Screen
          name={"Tobiano"}
          children={() => <Scorecard teebox={round1teebox} course={'scQ2spSAZK'} />}
          options={{
            tabBarActiveBackgroundColor: "#ff4057",
            tabBarActiveTintColor: "white",
          }}
        />
        <Tab.Screen
          name={"Big Horn"}
          children={() => <Scorecard teebox={round2teebox} course={'BruPe84n5T'} />}
          options={{
            tabBarActiveBackgroundColor: "#ff4057",
            tabBarActiveTintColor: "white",
          }}
        />
        <Tab.Screen
          name={"Dune"}
          children={() => <Scorecard teebox={round3teebox} course={'V48QyvQUdh'} />}
          options={{
            tabBarActiveBackgroundColor: "#ff4057",
            tabBarActiveTintColor: "white",
          }}
        />
        <Tab.Screen
          name={"Leaderboard"}
          component={Leaderboard}
          options={{
            tabBarActiveBackgroundColor: "#ff4057",
            tabBarActiveTintColor: "white",
          }}
        />
      </Tab.Navigator>
    </View>
  );
};

export default BottomTabNavigator;
