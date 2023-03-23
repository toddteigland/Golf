import React, { useContext, useState } from "react";
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

const BottomTabNavigator = () => {
  const { teebox, setTeebox } = useContext(TournamentContext);
  const [modalVisible, setModalVisible] = useState(false);
  const [teeboxOptions, setTeeboxOptions] = useState([]);
  // const [courseId, setCourseId] = ('');

  const handleTeeboxSelection = (routeName) => {
    setModalVisible(true);
    showAlert(routeName);
  };

  const showAlert = async (courseName) => {
    if (courseName == 'Tobiano') {
      courseId = 'scQ2spSAZK'
    }else if (courseName === 'Big Horn') {
      courseId = 'BruPe84n5T'
    }else if (courseName === 'Dune') {
      courseId = 'V48QyvQUdh';

    }
    console.log("COURSE ID : ", courseId);
    const Tee = Parse.Object.extend("Tee");
    const query = new Parse.Query(Tee);
    query.equalTo("course", {
      __type: "Pointer",
      className: "Course",
      objectId: courseId,
    }); // replace "courseId" with the actual objectId of the course you want to filter by
    try {
      const results = await query.find();
      console.log("RESULTS: ", results);

      const options = results.map((result) => ({
        text: `${result.get('name')} (${result.get('total_yardage')} yards)`,
        onPress: () => {
          setTeebox(result.get("name"));
          setModalVisible(false);
        },
      }));

      setTeeboxOptions([
        ...options,
        { text: "Cancel", onPress: () => setModalVisible(false) },
      ]);
      console.log(" OPTIONS: ", options);
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
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text style={{ fontSize: 18 }}>{route.name}</Text>
              {teebox ? (
                <TouchableOpacity
                  style={{ marginLeft: 200 }}
                  onPress={() => handleTeeboxSelection(route.name)}
                >
                  <Text
                    style={{
                      fontSize: 16,
                      marginLeft: 8,
                      borderColor: "grey",
                      borderWidth: 1,
                      borderRadius: 8,
                      padding: 5,
                    }}
                  >{`${teebox} tees`}</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={{ marginLeft: 208 }}
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
          children={() => <Scorecard teebox={teebox} />}
          options={{
            tabBarActiveBackgroundColor: "#ff4057",
            tabBarActiveTintColor: "white",
          }}
        />
        <Tab.Screen
          name={"Big Horn"}
          children={() => <Scorecard teebox={teebox} />}
          options={{
            tabBarActiveBackgroundColor: "#ff4057",
            tabBarActiveTintColor: "white",
          }}
        />
        <Tab.Screen
          name={"Dune"}
          children={() => <Scorecard teebox={teebox} />}
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
