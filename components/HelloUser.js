import React, {useEffect, useState} from 'react';
import {Text, View} from 'react-native';
import Parse from 'parse/react-native';

Parse.initialize(
  "0dyjfXKItbkSKG2YaOxFtUAxkhY98oL3pNd8eSzs",
  "j8PP6pYFYQ3SBZZCOuUDj2ZGO2zUnlTRRvkjMiUX"
);
Parse.serverURL = "https://parseapi.back4app.com/";







export const HelloUser = () => {
  // Define retrieveHandicap function inside the component
  const retrieveHandicap = async (objectId) => {
    const query = new Parse.Query('Handicap');
    query.equalTo('owner', { __type: 'Pointer', className: '_User', objectId: objectId });
    try {
      const result = await query.first();
      return result ? result.get('Handicap') : null;
    } catch (error) {
      console.error('Error retrieving handicap:', error);
      return null;
    }
  };

  // State variables that will hold username and handicap values
  const [username, setUsername] = useState('');
  const [handicap, setHandicap] = useState(0);

  // useEffect is called after the component is initially rendered and
  // after every other render
  useEffect(() => {
    // Since the async method Parse.User.currentAsync is needed to
    // retrieve the current user data, you need to declare an async
    // function here and call it afterwards
    async function getCurrentUser() {
      // This condition ensures that username is updated only if needed
      if (username === '') {
        const currentUser = await Parse.User.currentAsync();
        if (currentUser !== null) {
          setUsername(currentUser.getUsername());
          const handicap = await retrieveHandicap(currentUser.id);
          setHandicap(handicap);
        }
      }
    }
    getCurrentUser();
  }, [username]);

  // Note the condition operator here, so the "Hello" text is only
  // rendered if there is an username value
  return (
    <View>
      <View>
        {username !== '' && <Text style={{ fontSize: 30, color: 'red', margin: 25 }}>{`Hello ${username} (${handicap})`}</Text>}
      </View>
    </View>
  );
};

