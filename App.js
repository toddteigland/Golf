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
import { useEffect, useState } from "react";
import UserLogin from "./components/UserLogin.js";  
import { AuthContext } from "./components/context/AuthContext";

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


  useEffect(() => {
    async function getCurrentUser() {
      const query = new Parse.Query("User");
      const currentUser = await Parse.User.currentAsync();
      console.log("CURRENT USER FROM APP USEEFFECT: ", currentUser);
      if (currentUser !== null) {
        const user = await query.get(currentUser);
        setUsername(currentUser.getUsername());
        // setHandicap(user.get("handicap"));
      }
    }
    getCurrentUser();
  }, [username]);

  return (
    <AuthContext.Provider value={{ username, setUsername }}>
      <NavigationContainer>
        <Drawer.Navigator initialRouteName="Home">
          {/* ALWAYS SHOWN ------------------------------------------------------------------------------------------------------------------ */}
          <Drawer.Screen
            name="Home"
            component={Home}
            options={{
              headerStyle: {
                backgroundColor: "#DCDCDC",
              },
              headerTintColor: "#282634",
            }}
          />
          {/* ONLY IF LOGGED IN ------------------------------------------------------------------------------------------------------------ */}
          {username ? (
            <>
              <Drawer.Screen
                name="Profile"
                component={Profile}
                options={{
                  headerStyle: {
                    backgroundColor: "#DCDCDC",
                  },
                  headerTintColor: "#282634",
                }}
                />
              <Drawer.Screen
                name="Tournaments"
                component={TournamentList}
                options={{
                  headerStyle: {
                    backgroundColor: "#DCDCDC",
                  },
                  headerTintColor: "#282634",
                }}
                />
              <Drawer.Screen
                name="ScoreCard"
                component={Scorecard}
                options={{
                  headerStyle: {
                    backgroundColor: "#DCDCDC",
                  },
                  headerTintColor: "#282634",
                }}
                />
            </>
          ) : (

  // --------------NOT LOGGED IN ---------------------------------------------------
            <>
              <Drawer.Screen
                name="Login"
                component={UserLogin}
                options={{
                  headerStyle: {
                    backgroundColor: "#DCDCDC",
                  },
                  headerTintColor: "#282634",
                }}
              />
              <Drawer.Screen
                name="Create User"
                component={CreateUser}
                options={{
                  headerStyle: {
                    backgroundColor: "#DCDCDC",
                  },
                  headerTintColor: "#282634",
                }}
                />
            </>
          )}

        </Drawer.Navigator>
      </NavigationContainer>
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
