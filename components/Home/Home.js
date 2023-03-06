import React, { useState, useEffect } from 'react';
import { View, Text, Button } from 'react-native';
import Parse from 'parse/react-native';
import { HelloUser } from '../HelloUser';
import { UserLogin } from '../UserLogin';
import { CreateUser } from '../CreateUser/CreateUser';

export default function Home({ navigation }) {
  const [loggedIn, setLoggedIn] = useState(false);

  
  async function handleLogout() {
    await Parse.User.logOut();
    setLoggedIn(false);
  }
  
  useEffect(() => {
    async function checkLoginStatus() {
      const currentUser = await Parse.User.currentAsync();
      setLoggedIn(currentUser !== null);
    }
    checkLoginStatus();
  }, []);


  function handleCreateUser() {
    setLoggedIn(true);
  }

  return (
    <View>
      {loggedIn ? (
        <View>
          <HelloUser />
          <Button title="Logout" style={{color: 'red'}}onPress={handleLogout} />
        </View>
      ) : (
        <View>
           <UserLogin />
          <View>
            <Text style={{ color: 'red', marginTop: 50 }}>'First Timer?'</Text>
          </View>
          <View>
            <CreateUser onUserCreated={handleCreateUser} />
          </View>
        </View>
      )}
    </View>
  );
}
