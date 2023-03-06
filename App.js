import { NavigationContainer } from "@react-navigation/native";
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Home from './components/Home/Home.js';
import {CreateUser} from './components/CreateUser/CreateUser.js';
import { UserLogin } from "./components/UserLogin";
import AsyncStorage from '@react-native-async-storage/async-storage';
import Parse from 'parse/react-native';


Parse.setAsyncStorage(AsyncStorage);
Parse.initialize(
  '0dyjfXKItbkSKG2YaOxFtUAxkhY98oL3pNd8eSzs',
 'j8PP6pYFYQ3SBZZCOuUDj2ZGO2zUnlTRRvkjMiUX');
Parse.serverURL = 'https://parseapi.back4app.com/'

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={Home}
          options={{
            title: 'Welcome to the Sandbagger Invitational',
            headerStyle: {
              backgroundColor: '#f4511e',
            },
            headerTintColor: '#fff'
          }}
          />       
          <Stack.Screen
            name='Login'
            component={UserLogin}
            options={{
              title: 'Login User'
            }}
          />
        <Stack.Screen
          name="Create"
          component={CreateUser}
          options={{
            title: 'Create User'
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
