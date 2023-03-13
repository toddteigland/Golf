import { registerRootComponent } from "expo";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createDrawerNavigator } from "@react-navigation/drawer";
import CreateUser from "./components/CreateUser/CreateUser.js";
import Home from "./components/Home.js";
import Profile from "./components/Profile";
import TournamentList from "./components/Tournaments.js";
import Scorecard from "./components/Scorecard.js";
import Parse from "parse/react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import UserLogin from "./components/UserLogin.js";
import { AuthContext } from "./components/context/AuthContext";
import { TournamentContext } from "./components/context/TournamentContext.js";
import BottomTabNavigator from "./components/navigations/BottomTabNavigator.js";

Parse.setAsyncStorage(AsyncStorage);
Parse.initialize(
  "0dyjfXKItbkSKG2YaOxFtUAxkhY98oL3pNd8eSzs",
  "j8PP6pYFYQ3SBZZCOuUDj2ZGO2zUnlTRRvkjMiUX"
);
Parse.serverURL = "https://parseapi.back4app.com/";

// const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

export default function App() {
  const [username, setUsername] = useState(null);
  const [handicap, setHandicap] = useState(null);
  const [myTournaments, setMyTournaments] = useState([]);

  useEffect(() => {
    async function getCurrentUser() {
      const query = new Parse.Query("User");
      const currentUser = await Parse.User.currentAsync();
      if (currentUser !== null) {
        const user = await query.get(currentUser);
        setUsername(currentUser.getUsername());
      }
    }
    getCurrentUser();
  }, [username]);

  useEffect(() => {
    async function fetchMyTournaments() {
      const currentUser = await Parse.User.currentAsync();
      const query = new Parse.Query("Tournaments");
      query.equalTo("players", currentUser);
      query.find().then(
        (results) => {
          setMyTournaments(results);
        },
        (error) => {
          console.error(error);
        }
      );
    }
    fetchMyTournaments();
  }, [myTournaments.length]);

  return (
    <AuthContext.Provider
      value={{ username, setUsername, handicap, setHandicap }}
    >
      <TournamentContext.Provider value={{ myTournaments, setMyTournaments }}>
        <NavigationContainer>
          <Drawer.Navigator initialRouteName="Home" screenOptions={{headerStyle: {
                  backgroundColor: "#DCDCDC",
                },
                headerTintColor: "#282634",}}>
            {/* ALWAYS SHOWN ------------------------------------------------------------------------------------------------------------------ */}
            <Drawer.Screen
              name="Home"
              component={Home}
            />
            {/* ONLY IF LOGGED IN ------------------------------------------------------------------------------------------------------------ */}
            {username ? (
              <>
                <Drawer.Screen
                  name="Profile"
                  component={Profile}
                />
                <Drawer.Screen
                  name="Tournaments"
                  component={TournamentList}
                />
                {/* <Drawer.Screen
                  name="ScoreCard"
                  component={Scorecard}
                /> */}
                <Drawer.Screen
                  name="Tournament Name"
                  component={BottomTabNavigator} />
              </>
            ) : (
              // --------------NOT LOGGED IN ---------------------------------------------------
              <>
                <Drawer.Screen
                  name="Login"
                  component={UserLogin}
                />
                <Drawer.Screen
                  name="Create User"
                  component={CreateUser}
                />
              </>
            )}
          </Drawer.Navigator>
        </NavigationContainer>
      </TournamentContext.Provider>
    </AuthContext.Provider>
  );
}
registerRootComponent(App);

// <NavigationContainer>
//   <Stack.Navigator>
//     <Stack.Screen
//       name="Authenticate"
//       component={Authenticate}
//       options={{
//         title: "Welcome to the Sandbagger Invitational",
//         headerStyle: {
//           backgroundColor: "#ff4057",
//         },
//         headerTintColor: "#282634",
//       }}
//     />
//     {/* <Stack.Screen
//         name='Login'
//         component={UserLogin}
//         options={{
//           title: 'Login User'
//         }}
//       /> */}
//   </Stack.Navigator>
// </NavigationContainer>
