import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Scorecard from "../Scorecard";
import Leaderboard from "../Leaderboard";

const Tab = createBottomTabNavigator();

const BottomTabNavigator = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen name={"Round 1"} component={Scorecard} />
      <Tab.Screen name={"Round 2"} component={Scorecard} />
      <Tab.Screen name={"Round 3"} component={Scorecard} />
      <Tab.Screen name={"Leaderboard"} component={Leaderboard} />
    </Tab.Navigator>
  );
}

export default BottomTabNavigator;
