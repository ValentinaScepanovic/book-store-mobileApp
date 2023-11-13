import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList, StyleSheet } from 'react-native';
import axios from 'axios';
import Header from './Header';

const Search = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    const performSearch = async () => {
      try {
        if (searchQuery.trim() === '') {
          setSearchResults([]);
        } else {
          const response = await axios.get(`http://192.168.8.100:3000/search?q=${searchQuery}`);
          setSearchResults(response.data);
        }
      } catch (error) {
        console.error('Error searching:', error);
      }
    };
    performSearch();
  }, [searchQuery]);

  return (
    <View style={styles.container}>
      <Header navigation={navigation} />
      <View style={styles.containerBook}>
        <TextInput
          style={styles.input}
          placeholder="Search by book name or author"
          value={searchQuery}
          onChangeText={(text) => setSearchQuery(text)}
        />
        {searchQuery.trim() === '' ? null : (
          searchResults.length === 0 ? (
            <Text>No books found</Text>
          ) : (
            <FlatList
              data={searchResults}
              keyExtractor={(item) => item._id}
              renderItem={({ item }) => (
                <View style={styles.resultItem}>
                  <Text>{item.bookName}</Text>
                  <Text>{item.author}</Text>
                </View>
              )}
            />
          )
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'bisque',
    flex: 1,
  },
  containerBook: {
    flex: 1,
    padding: 16,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    backgroundColor: 'white',
    borderRadius: 10,
    borderWidth: 1,
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  resultItem: {
    borderBottomWidth: 1,
    borderColor: 'sienna',
    paddingVertical: 8,
  },
});

export default Search;