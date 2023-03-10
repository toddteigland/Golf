import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TextInput } from 'react-native';
import Parse from 'parse/react-native';

const ScorecardList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');
  const [scorecards, setScorecards] = useState([]);

  useEffect(() => {
    const fetchScorecards = async () => {
      const Scorecard = Parse.Object.extend('Scorecard');
      const query = new Parse.Query(Scorecard);

      // Filter by search term
      if (searchTerm) {
        query.contains('courseName', searchTerm);
      }

      // Sort by par
      if (sortOrder === 'asc') {
        query.ascending('data.Par');
      } else {
        query.descending('data.Par');
      }

      const results = await query.find();
      const formattedResults = results.map((result) => ({
        id: result.id,
        courseName: result.get('courseName'),
        data: result.get('data'),
      }));
      setScorecards(formattedResults);
    };

    fetchScorecards();
  }, [searchTerm, sortOrder]);

  return (
    <View>
      <TextInput
        placeholder="Search by course name"
        onChangeText={setSearchTerm}
        value={searchTerm}
      />
      <Text>Sort by par:</Text>
      <Text onPress={() => setSortOrder('asc')}>Ascending</Text>
      <Text onPress={() => setSortOrder('desc')}>Descending</Text>
      <FlatList
        data={scorecards}
        keyExtractor={(scorecard) => scorecard.id}
        renderItem={({ item }) => (
          <View>
            <Text>{item.courseName}</Text>
            {item.data.map((hole, index) => (
              <Text key={index}>
                Hole {index + 1}: {hole.Par}
              </Text>
            ))}
          </View>
        )}
      />
    </View>
  );
};

export default ScorecardList;
