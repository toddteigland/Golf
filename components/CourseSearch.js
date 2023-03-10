import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';

const CourseSearch = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const handleSearch = async () => {
    try {
      const response = await fetch(`https://api.golfscorekeeper.com/scorecards?q=${searchTerm}`);
      const data = await response.json();
      setSearchResults(data.scorecards);
    } catch (error) {
      console.error(error);
      console.log(error.message);

    }
  };

  return (
    <View>
      <TextInput
        placeholder="Search for a golf course"
        onChangeText={setSearchTerm}
        value={searchTerm}
      />
      <TouchableOpacity onPress={handleSearch}>
        <Text>Search</Text>
      </TouchableOpacity>
      {searchResults.map((scorecard) => (
        <View key={scorecard.id}>
          <Text>{scorecard.courseName}</Text>
          <Text>Par: {scorecard.par}</Text>
          <Text>Yardage: {scorecard.yardage}</Text>
        </View>
      ))}
    </View>
  );
};

export default CourseSearch;
