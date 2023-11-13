import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Button, Alert,StyleSheet,SafeAreaView,TouchableOpacity,Image,ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome';
import axios from 'axios';
import Header from './Header';

const Profile = ({ route,navigation }) => {
  const [userId, setUserId] = useState(null);
  const [userData, setUserData] = useState(null);
  const [userBooks, setUserBooks] = useState([]);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    AsyncStorage.getItem('userId')
      .then((userId) => {
        if (userId) {
          setUserId(userId);
          //get user by id
          axios.get(`http://192.168.8.100:3000/users/${userId}`)
            .then((response) => {
              setUserData(response.data);
              setLoading(false);
            })
            .catch((error) => {
              console.error('Error fetching user data:', error);
              setLoading(false);
            });
          // get books of this user 
          axios.get(`http://192.168.8.100:3000/users/${userId}/books`)
            .then((response) => {
              setUserBooks(response.data.reverse());
              setLoading(false);
            })
            .catch((error) => {
              console.error('Error fetching user books:', error);
              setLoading(false);
            });
        }
      })
      .catch((error) => {
        console.error('Error retrieving userId from AsyncStorage:', error);
        setLoading(false);
      });

 const updatedBookData = route.params?.updatedBookData;
  if (updatedBookData) {
    handleUpdateBook(updatedBookData);
  }}, [route.params?.updatedBookData]);

  const handleEditBook = (bookId) => {
    navigation.navigate('Edit Book', { bookId });
  };

// delete book
  const handleDeleteBook = (bookId) => {
    Alert.alert(
      'Delete Book',
      'Are you sure you want to delete this book?',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {
          text: 'Delete',
          onPress: () => {
            axios
              .delete(`http://192.168.8.100:3000/books/${bookId}`)
              .then(() => {
                setUserBooks((prevBooks) =>
                  prevBooks.filter((book) => book._id !== bookId)
                );
              })
              .catch((error) => {
                console.error('Error deleting book:', error);
              });
          },
          style: 'destructive',
        },
      ],
      { cancelable: false }
    );
  };
  
// immediatly update book
  const handleUpdateBook = (updatedBookData) => {
    const updatedBookIndex = userBooks.findIndex((book) => book._id === updatedBookData._id);
    if (updatedBookIndex !== -1) {
      setUserBooks((prevBooks) => {
        const newBooks = [...prevBooks];
        newBooks[updatedBookIndex] = updatedBookData;
        return newBooks;
      });
    }
  };

  //log out
  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('userToken');
      navigation.navigate('Login'); 
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor:'bisque'}}>
      <Header navigation={navigation}/>
      {isLoading ? (
        <ActivityIndicator size="large" color="sienna" />
      ) : (
      <View style={styles.containerProfile}>
      {userData && (
        <View style={styles.containerUser}>
          <Text style={styles.labelUser}>Username: {userData.userName}</Text>
          <Text style={styles.labelUser}>Name: {userData.name}</Text>
          <TouchableOpacity onPress={handleLogout}>
          <Icon name="sign-out" size={30} color="bisque" />
        </TouchableOpacity>
        </View>
      )}
      <Text style={styles.title}>Books:</Text>
      <View style={styles.separator} />
      <View>
        <FlatList
          data={userBooks}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => {
            return (
              <View style={styles.bookContainer}>
               <View style={styles.imageContainer}>
                 <Image source={{ uri: item.imageData }} style={styles.bookImage}/>
               </View>
             <View style={styles.bookDetails}>
               <Text style={styles.label}>Book Name: {item.bookName}</Text>
               <Text style={styles.label}>Author: {item.author}</Text>
               <Text style={styles.label}>Genre: {item.genre}</Text>
               <Text style={styles.label}>Description: {item.description}</Text>
               <Text style={styles.label}>Price: {item.price}</Text>
               <Button title="Edit Book" onPress={() => handleEditBook(item._id)} color='sienna'/>
               <Button title="Delete Book" onPress={() => handleDeleteBook(item._id)} color='sienna'/>
               <View style={styles.separator}></View>
             </View>
           </View>
            );
          }}
        />
      </View>
      </View>
      )}
      </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  containerProfile: {
    flex:1,
    backgroundColor:'bisque',
    padding: 10,
  },
  bookContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
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
    marginTop:-100,
    width: 100,
    height: 150,
    resizeMode: 'cover',
  },
  containerUser:{
  flexDirection: 'row', 
  justifyContent: 'space-between',
  borderRadius: 5,
  padding: 10,
  marginBottom: 5,
  backgroundColor: 'sienna',
  },
  labelUser:{
    fontSize:17,
    color:'bisque'
  },
  title:{
    fontSize:20
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

export default Profile;