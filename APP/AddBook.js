import React, { useState, useEffect } from 'react';
import { View, Button, Text, TextInput, StyleSheet,ImageBackground,Image,ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios'; 
import * as Location from 'expo-location';
import { Camera } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';

const AddBook = ({navigation}) => {
  const [userId, setUserId] = useState(null);
  const [imageData, setImageData] = useState(null);
  const [bookName, setBookName] = useState('');
  const [author, setAuthor] = useState('');
  const [genre, setGenre] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState(0.0);

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
    }
  ,[]);
//get permission
  useEffect(() => {
    getImagePickerPermission();
  }, []);

  const getImagePickerPermission = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Permission to access photos is required.');
    }
  };

  const openGallery = async () => {
    const { status } = await Camera.requestCameraPermissionsAsync();
    if (status === 'granted') {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled && result.assets.length > 0) {
        const imageUri = result.assets[0].uri;
        setImageData(imageUri);
      }
    }
  };
  const openCamera = async () => {
    const { status } = await Camera.requestCameraPermissionsAsync();
    if (status === 'granted') {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
  
      if (!result.canceled && result.assets.length > 0) {
        const imageUri = result.assets[0].uri;
        setImageData(imageUri);
      }
    }
  };
  
  const addNewBook = async () => {
    try {
      //location permission
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        const location = await Location.getCurrentPositionAsync({});
        const { latitude, longitude } = location.coords;

        const locationData = { latitude, longitude };

        const response = await axios.post('http://192.168.8.100:3000/books', {
          bookName,
          author,
          genre,
          description,
          price: parseFloat(price),
          userId,
          imageData,
          location: locationData
        });
        const newBookData = response.data;
        alert("Book is added!");
        navigation.navigate('Home', { newBookData });
      } else {
        console.log('Location permission denied');
      }
    } catch (error) {
      console.error('Error adding book:', error);
    }
  };
  
  return (
    <ImageBackground
      source={require('./assets/pocetna.jpg')}
      style={styles.background}
    >
    <ScrollView contentContainerStyle={styles.container}>
    {imageData && (<Image source={{uri: imageData, }}style={{ width: 100, height: 150 }}/>)}

      <Button title="Select Image from Gallery" onPress={openGallery} color='sienna'/>
      <Button title="Take a Photo" onPress={openCamera} color='sienna'/>


      <Text>Book Name:</Text>
      <TextInput
        placeholder="Book Name"
        value={bookName}
        onChangeText={(text) => setBookName(text)}
        style={styles.input}
      />
      <Text>Author:</Text>
      <TextInput
        placeholder="Author"
        value={author}
        onChangeText={(text) => setAuthor(text)}
        style={styles.input}
      />
      <Text>Genre:</Text>
      <TextInput
        placeholder="Genre"
        value={genre}
        onChangeText={(text) => setGenre(text)}
        style={styles.input}
      />
      <Text>Description:</Text>
      <TextInput
        placeholder="Description"
        value={description}
        onChangeText={(text) => setDescription(text)}
        multiline={true} 
        numberOfLines={5} 
        style={styles.input}
      />
      <Text>Price:</Text>
      <TextInput
        placeholder="Price"
        value={price.toString()} 
        onChangeText={(text) => setPrice(text)}
        style={styles.input}
      />
<Button title="Add Book" onPress={addNewBook} color='sienna'/>
    </ScrollView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    backgroundColor: 'burlywood',
    flex: 1,
    alignItems: 'center',
    padding:15,
  },
  input: {
    width: 200,
    height: 30,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: '#ccc',
    paddingHorizontal: 10,
    marginBottom: 10,
    backgroundColor: 'white',
  },
});

export default AddBook;