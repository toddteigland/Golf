import { registerRootComponent } from "expo";
import { NavigationContainer, useNavigation } from "@react-navigation/native";
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
import { Text, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

Parse.setAsyncStorage(AsyncStorage);
Parse.initialize(
  "0dyjfXKItbkSKG2YaOxFtUAxkhY98oL3pNd8eSzs",
  "j8PP6pYFYQ3SBZZCOuUDj2ZGO2zUnlTRRvkjMiUX"
);
Parse.serverURL = "https://parseapi.back4app.com/";

const Drawer = createDrawerNavigator();

export default function App() {
  const [username, setUsername] = useState(null);
  const [handicap, setHandicap] = useState(null);
  const [myTournaments, setMyTournaments] = useState([]);
  const [currentTournament, setCurrentTournament] = useState({
    course1: {
      name: null,
      tee: null,
    },
    course2: {
      name: null,
      tee: null,
    },
    course3: {
      name: null,
      tee: null,
    },
  });


  // const [round1teebox, setRound1Teebox] = useState("");
  // const [round2teebox, setRound2Teebox] = useState("");
  // const [round3teebox, setRound3Teebox] = useState("");
  const [teebox, setTeebox] = useState(null);

  useEffect(() => {
    async function getCurrentUser() {
      const query = new Parse.Query("User");
      const currentUser = await Parse.User.currentAsync();
      if (currentUser !== null) {
        const user = await query.get(currentUser);
        setUsername(currentUser.getUsername());
        setHandicap(user.get("handicap"));
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

  // const tournamentName = (navigation) => {
  //   const exitTournament = () => {
  //     setCurrentTournament({});
  //     navigation.goBack("Profile");
  //   };
  //   return (
  //     <View>
  //       {currentTournament ? (
  //         <View>
  //           <Text style={{ fontWeight: "bold", fontSize: 20 }}>
  //             {currentTournament.get("name")}
  //           </Text>
  //         </View>
  //       ) : (
  //         <Text>OOOOO Farts.</Text>
  //       )}
  //     </View>
  //   );
  // };

  return (
    <AuthContext.Provider
      value={{ username, setUsername, handicap, setHandicap }}
    >
      <TournamentContext.Provider
        value={{
          myTournaments,
          setMyTournaments,
          currentTournament,
          setCurrentTournament,
          teebox,
          setTeebox,
        }}
      >
        <NavigationContainer>
          <Drawer.Navigator
            initialRouteName="Home"
            screenOptions={{
              headerStyle: {
                backgroundColor: "#DCDCDC",
              },
              headerTintColor: "#282634",
            }}
          >
            {/* ALWAYS SHOWN ------------------------------------------------------------------------------------------------------------------ */}
            <Drawer.Screen name="Home" component={Home} />

            {/* ONLY IF LOGGED IN ------------------------------------------------------------------------------------------------------------ */}
            {username ? (
              <>
                <Drawer.Screen name="Profile" component={Profile} />
                <Drawer.Screen name="Tournaments" component={TournamentList} />
                {/* <Drawer.Screen
                  name="ScoreCard"
                  component={Scorecard}
                /> */}

                {currentTournament && (
                  <Drawer.Screen
                    name="Play Sandbagger"
                    component={BottomTabNavigator}
                    options={({ navigation }) => ({
                      headerTitle: "2023 Sandbagger Invitational",
                      headerRight: () => (
                        <TouchableOpacity
                          onPress={() => navigation.navigate("Profile")}
                        >
                          <Text
                            style={{
                              color: "red",
                              marginRight: 10,
                              backgroundColor: "#282634",
                              width: 50,
                              height: 30,
                              borderRadius: 8,
                              textAlign: "center",
                            }}
                          >
                            Exit
                          </Text>
                        </TouchableOpacity>
                      ),
                    })}
                  />
                )}
              </>
            ) : (
              // --------------NOT LOGGED IN ---------------------------------------------------
              <>
                <Drawer.Screen name="Login" component={UserLogin} />
                <Drawer.Screen name="Create User" component={CreateUser} />
              </>
            )}
          </Drawer.Navigator>
        </NavigationContainer>
      </TournamentContext.Provider>
    </AuthContext.Provider>
  );
}
registerRootComponent(App);
