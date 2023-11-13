import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, SafeAreaView, Button, Image,ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { reverseGeocodeAsync } from 'expo-location';
import axios from 'axios';
import Header from './Header';

const Home = ({ navigation, route }) => {
  const [books, setBooks] = useState([]);
  const [userId, setUserId] = useState(null);
  const [isLoading, setLoading] = useState(true);

  //get userId
  useEffect(() => {
    AsyncStorage.getItem('userId')
      .then((userId) => {
        if (userId) {
          setUserId(userId);
        }
      })
      .catch((error) => {
        console.error('Error retrieving userId from AsyncStorage:', error);
      });

    //get all books
    axios.get('http://192.168.8.100:3000/books')
      .then(async (response) => {
        const booksWithLocation = await Promise.all(
          response.data.map(async (book) => {
            if (book.location && typeof book.location.coordinates[0] === 'number' && typeof book.location.coordinates[1] === 'number') {
              const locationDetails = await reverseGeocodeAsync({
                latitude: book.location.coordinates[1],
                longitude: book.location.coordinates[0],
              });
              const city = locationDetails[0]?.city;
              const country = locationDetails[0]?.country;
              return { ...book, city, country };
            } else {
              console.error(`Invalid location for book with ID ${book._id}`);
              return book;
            }
          })
        );
        setBooks(booksWithLocation.reverse());
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching books:', error);
        setLoading(false);
      });
    //add new book immediatly
    const newBookData = route.params?.newBookData;
    if (newBookData) {
      setBooks((prevBooks) => [newBookData, ...prevBooks]);
    }
  }, [route.params?.newBookData]);

  //add book to the shopping bag
  const addToShoppingBag = async (book) => {
    try {
      if (!userId) {
        console.error('User is not authenticated. Please set userId after authentication.');
        return;
      }
      const existingSelectedBookIdsJson = await AsyncStorage.getItem(`selectedBookIds_${userId}`);
      const existingSelectedBookIds = existingSelectedBookIdsJson ? JSON.parse(existingSelectedBookIdsJson) : [];

      if (existingSelectedBookIds.includes(book._id)) {
        alert('Book is already in the Shopping Bag!');
        return;
      }
      existingSelectedBookIds.push(book._id);

      const updatedSelectedBookIdsJson = JSON.stringify(existingSelectedBookIds);
      await AsyncStorage.setItem(`selectedBookIds_${userId}`, updatedSelectedBookIdsJson);

      alert('Book added to the Shopping Bag!');
    } catch (error) {
      console.error('Error adding book ID to Shopping Bag:', error);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'bisque' }}>
      <Header navigation={navigation} />
      {isLoading ? (
        <ActivityIndicator size="large" color="sienna" />
      ) : (
      <View style={styles.bookContainer}>
        <FlatList
          data={books}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <View style={styles.bookItem}>
              <Image
                source={{ uri: item.imageData }}
                style={styles.bookImage}
              />
              <View style={styles.bookInfo}>
                <Text style={styles.label}>Book Name: {item.bookName}</Text>
                <Text style={styles.label}>Author: {item.author}</Text>
                <Text style={styles.label}>Genre: {item.genre}</Text>
                <Text style={styles.label}>Description: {item.description}</Text>
                <Text style={styles.label}>Price: {item.price}</Text>
                <Text style={styles.label}>Location: {item.city}, {item.country}</Text>
                {item.userId !== userId && (
                  <Button title="Add this book to Shopping Bag" onPress={() => addToShoppingBag(item)} color="sienna" />
                )}
                <View style={styles.separator}></View>
              </View>
            </View>
          )}
        />
      </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  bookContainer: {
    flex: 1,
    backgroundColor: 'bisque',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  bookItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  bookImage: {
    marginTop:-50,
    width: 100,
    height: 150,
    resizeMode: 'cover',
  },
  bookInfo: {
    marginLeft: 10,
    flex: 1,
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

export default Home;