import React, { useState, useEffect } from 'react';
import { View, Text, Button } from 'react-native';
import Parse from 'parse/react-native';
import { HelloUser } from '../HelloUser';
import { UserLogin } from '../UserLogin';

export default function Home({ navigation }) {
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    async function checkLoginStatus() {
      const currentUser = await Parse.User.currentAsync();
      setLoggedIn(currentUser !== null);
    }
    checkLoginStatus();
  }, []);

  async function handleLogout() {
    await Parse.User.logOut();
    setLoggedIn(false);
  }

  return (
    <View>
      {loggedIn ? (
        <View>
          <HelloUser />
          <Button title="Logout" onPress={handleLogout} />
        </View>
      ) : (
        <View>
          <Text>Home</Text>
          <UserLogin />
          <View>
            <Text style={{ color: 'red', marginTop: 50 }}>'First Timer?'</Text>
          </View>
          <View>
            <Button
              title="Create User"
              onPress={() => navigation.navigate('Create')}
            />
          </View>
        </View>
      )}
    </View>
  );
}
