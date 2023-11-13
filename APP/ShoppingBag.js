import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet,Button,SafeAreaView,Image,ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Header from './Header';

const ShoppingBag = ({ navigation }) => {
  const [selectedBookIds, setSelectedBookIds] = useState([]);
  const [selectedBooks, setSelectedBooks] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  useEffect(() => {
    getSelectedBookIdsFromStorage();
  }, []);

//get books from storage
  const getSelectedBookIdsFromStorage = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      const selectedBookIdsJson = await AsyncStorage.getItem(`selectedBookIds_${userId}`);

      if (selectedBookIdsJson) {
        const selectedBookIdsArray = JSON.parse(selectedBookIdsJson);
        setSelectedBookIds(selectedBookIdsArray);
        fetchSelectedBooks(selectedBookIdsArray);
      } else {
        setLoading(false);
      }
    } catch (error) {
      console.error('Error retrieving selected book IDs from AsyncStorage:', error);
      setError('Error retrieving selected book IDs from AsyncStorage');
      setLoading(false); 
    }
  };

  //fatch informations about books
  const fetchSelectedBooks = async (bookIds) => {
    try {
      const bookPromises = bookIds.map(async (bookId) => {
        try {
          const response = await axios.get(`http://192.168.8.100:3000/books/${bookId}`);
          return response.data;
        } catch (error) {
          return null;
        }
      });
  
      const booksData = await Promise.all(bookPromises);
      const selectedBooksData = booksData.filter((book) => book !== null);
  
      setSelectedBooks(selectedBooksData);
      setLoading(false); 
    } catch (error) {
      console.error('Error fetching selected books:', error);
      setError('Error fetching selected books from the server');
      setLoading(false); 
    }
  };
  // removing book from storage
  const handleRemoveBook = async (bookId) => {
    try {
      const updatedSelectedBookIds = selectedBookIds.filter(id => id !== bookId);
      setSelectedBookIds(updatedSelectedBookIds);

      const userId = await AsyncStorage.getItem('userId');
      const existingSelectedBookIdsJson = await AsyncStorage.getItem(`selectedBookIds_${userId}`);
      
      if (!existingSelectedBookIdsJson) {
        return; 
      }
      const existingSelectedBookIds = JSON.parse(existingSelectedBookIdsJson);
      const updatedSelectedBookIdsAsync = existingSelectedBookIds.filter(id => id !== bookId);

      const updatedSelectedBookIdsJson = JSON.stringify(updatedSelectedBookIdsAsync);
      await AsyncStorage.setItem(`selectedBookIds_${userId}`, updatedSelectedBookIdsJson);

      alert('Book removed from the Shopping Bag!');
      //immediatly remove book
      setSelectedBooks(prevSelectedBooks => prevSelectedBooks.filter(book => book._id !== bookId));
    } catch (error) {
      console.error('Error removing book from Shopping Bag:', error);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor:'bisque'}}>
      <Header navigation={navigation} />
      {isLoading ? (
        <ActivityIndicator size="large" color="sienna" />
      ) : selectedBooks.length === 0 ? (
        <Text style={styles.label}>Your shopping bag is empty.</Text>
          ) : (
        <FlatList
            data={selectedBooks}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => (
                 <View style={styles.bookContainer}>
                 <View style={styles.imageContainer}>
        <Image
          source={{ uri: item.imageData }}
          style={styles.bookImage}
        />
      </View>
      <View style={styles.bookDetails}>
        <Text style={styles.label}>Book Name: {item.bookName}</Text>
        <Text style={styles.label}>Author: {item.author}</Text>
        <Text style={styles.label}>Genre: {item.genre}</Text>
        <Text style={styles.label}>Description: {item.description}</Text>
        <Text style={styles.label}>Price: {item.price}</Text>
        <Button title="Remove Book" onPress={() => handleRemoveBook(item._id)} color="sienna" />
        <View style={styles.separator}></View>
      </View>
    </View>
       )}
      />
      )}
     <View style={styles.separator}></View>
      
    <Button title="Buy Books" onPress={() => navigation.navigate('Buy')} color="sienna" />
    </SafeAreaView>
  )};
const styles = StyleSheet.create({
  container: {
    backgroundColor:'bisque',
    flex: 1,
  },
  bookContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  imageContainer: {
    flex: 1,
  },
  bookDetails: {
    flex: 2, 
    marginTop:5,
    marginLeft:-25,
  },
  bookImage: {
    marginTop:-50,
    width: 100,
    height: 150,
    resizeMode: 'cover',
  },
  loadingIndicator: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  label: {
    fontSize: 14,
  },
  separator: {
    borderBottomWidth: 2,        
    borderBottomColor: 'sienna',  
    marginVertical: 10,  
  },
});

export default ShoppingBag;