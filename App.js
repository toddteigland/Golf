import { registerRootComponent } from 'expo';
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createDrawerNavigator } from "@react-navigation/drawer";
import Authenticate from "./components/UserLogin.js";
import CreateUser from "./components/CreateUser/CreateUser.js";
import Home from "./components/Home.js";
import Profile from "./components/Profile"
import TournamentList from "./components/Tournaments.js";
import Scorecard from "./components/Scorecard.js";
import Parse from "parse/react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import UserLogin from './components/UserLogin.js';

Parse.setAsyncStorage(AsyncStorage);
Parse.initialize(
  "0dyjfXKItbkSKG2YaOxFtUAxkhY98oL3pNd8eSzs",
  "j8PP6pYFYQ3SBZZCOuUDj2ZGO2zUnlTRRvkjMiUX"
); 
Parse.serverURL = "https://parseapi.back4app.com/";

// const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

export default function App() {

  const [isLoggedIn, setIsLoggedIn] = useState(false);


  useEffect(() => {
  const retreiveState = async () => {
    try {
      const data = await AsyncStorage.getItem('keepLoggedIn');
      // const currentUser = await AsyncStorage.getItem(currentUser);
      // console.log('CURRENT user in App: ', currentUser);
      console.log('isloggedin status? ', isLoggedIn)
    } catch (error) {
      console.log(error);
    }
  }
  retreiveState();
  },[isLoggedIn]);

  return (
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
        {isLoggedIn ? (
          <>
          <Drawer.Screen
          name="Profile"
          component={Profile}
          initialParams={{setIsLoggedIn: setIsLoggedIn}}
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

        // ONLY IF NOT LOGGED IN ------------------------------------------------------------------------------------------------------------
          <>
          <Drawer.Screen
          name="Login"
          component={UserLogin}
          initialParams={{setIsLoggedIn: setIsLoggedIn}}
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
        initialParams={{setIsLoggedIn: setIsLoggedIn}}
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

