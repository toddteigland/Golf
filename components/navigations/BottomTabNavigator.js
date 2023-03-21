import React, { useContext, useState } from "react";
import { Image, View, TouchableOpacity, Text, Alert } from "react-native";
import { TournamentContext } from "../context/TournamentContext";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Scorecard from "../Scorecard";
import Leaderboard from "../Leaderboard";

const icon1 = require("../../assets/icons/icon1.png");
const icon2 = require("../../assets/icons/icon2.png");
const icon3 = require("../../assets/icons/icon3.png");
const iconLeaderboard = require("../../assets/icons/iconLeaderboard.png");

const Tab = createBottomTabNavigator();

const BottomTabNavigator = () => {
  const { teebox, setTeebox } = useContext(TournamentContext);

  const handleTeeboxSelection = (teebox) => {
    showAlert();
    setTeebox(teebox);

    console.log("TEE BOX SET TO: ", teebox);
  };

  const showAlert = () => {
    Alert.alert(
      "Select Tee Box",
      "Please select a tee box from the following options:",
      [
        {
          text: "Sage",
          onPress: () => setTeebox("sage"),
        },
        {
          text: "lake",
          onPress: () => setTeebox("lake"),
        },
        {
          text: "Cancel",
          onPress: () => setTeebox(''),
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerTitle: () => (
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text style={{ fontSize: 18 }}>{route.name}</Text>
            {teebox ? (
              <TouchableOpacity
                style={{ marginLeft: 8, }}
                onPress={() => handleTeeboxSelection()}
              >
                <Text
                  style={{ fontSize: 16, marginLeft: 8,borderColor: 'grey', borderWidth: 1, borderRadius: 8, padding: 5 }}
                >{`${teebox} tees`}</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={{ marginLeft: 8 }}
                onPress={() => handleTeeboxSelection()}
              >
                <Text style={{ fontSize: 16, borderColor: 'grey', borderWidth: 1, borderRadius: 8, padding: 5, backgroundColor: 'lightgrey' }}>Select Tee</Text>
              </TouchableOpacity>
            )}
          </View>
        ),
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === "Tobiano") {
            iconName = icon1;
          } else if (route.name === "Big Horn") {
            iconName = icon2;
          } else if (route.name === "Dune") {
            iconName = icon3;
          } else if (route.name === "Leaderboard") {
            iconName = iconLeaderboard;
          }
          return <Image source={iconName} style={{ width: 25, height: 25 }} />;
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
  );
};

export default BottomTabNavigator;
