import React from "react";
import { Image } from "react-native";

import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Scorecard from "../Scorecard";
import Leaderboard from "../Leaderboard";
const icon1 = require("../../assets/icons/icon1.png");
const icon2 = require("../../assets/icons/icon2.png");
const icon3 = require("../../assets/icons/icon3.png");
const iconLeaderboard = require("../../assets/icons/iconLeaderboard.png");


// import icon1 from "../../assets/icons/icon1.png";
// import icon2 from "../../assets/icons/icon2.png";
// import icon3 from "../../assets/icons/icon3.png";
// import iconLeaderboard from "../../assets/icons/iconLeaderboard.png";

const Tab = createBottomTabNavigator();

const BottomTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === "Round 1") {
            iconName = icon1;
          } else if (route.name === "Round 2") {
            iconName = icon2;
          } else if (route.name === "Round 3") {
            iconName = icon3;
          } else if (route.name === "Leaderboard") {
            iconName = iconLeaderboard;
          }
          return (
            <Image source={iconName} style={{ width: 20, height: 20 }} />
          );
        },
      })}
    >
      <Tab.Screen name={"Round 1"} component={Scorecard} />
      <Tab.Screen name={"Round 2"} component={Scorecard} />
      <Tab.Screen name={"Round 3"} component={Scorecard} />
      <Tab.Screen name={"Leaderboard"} component={Leaderboard} />
    </Tab.Navigator>
  );
};

export default BottomTabNavigator;
