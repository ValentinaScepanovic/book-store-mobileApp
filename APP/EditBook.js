import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Alert,StyleSheet,ImageBackground} from 'react-native';
import axios from 'axios';

const EditBook = ({ route, navigation }) => {
  const { bookId } = route.params;
  const [bookName, setBookName] = useState('');
  const [author, setAuthor] = useState('');
  const [genre, setGenre] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState(0.0);

  useEffect(() => {
    //get book by id
    axios.get(`http://192.168.8.100:3000/books/${bookId}`)
      .then((response) => {
        const bookData = response.data;
        setBookName(bookData.bookName);
        setAuthor(bookData.author);
        setGenre(bookData.genre);
        setDescription(bookData.description);
        setPrice(parseFloat(bookData.price));
      })
      .catch((error) => {
        console.error('Error fetching book details:', error);
      });
  }, [bookId]);

  const handleSaveChanges = () => {
    //edit book
    axios.put(`http://192.168.8.100:3000/books/${bookId}`, {
        bookName,
        author,
        genre,
        description,
        price: parseFloat(price),
      })
      .then((response) => {
        navigation.navigate('Profile', { updatedBookData: response.data });
      })
      .catch((error) => {
        console.error('Error updating book:', error);
      });
  };

  const handleCancelEditing = () => {
    Alert.alert(
      'Cancel Editing',
      'Are you sure you want to cancel editing? Your changes will not be saved.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: () => {
            navigation.goBack();
          },
        },
      ]
    );
  };

  return (
    <ImageBackground
      source={require('./assets/pocetna.jpg')}
      style={styles.background}
    >
    <View style={styles.container}>
      <Text>Book Name:</Text>
      <TextInput
        placeholder="Book Name"
        value={bookName}
        onChangeText={(text) => setBookName(text) }
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
        style={styles.input}
      />
      <Text>Price:</Text>
      <TextInput
        placeholder="Price"
        value={price.toString()}
        onChangeText={(text) => setPrice(text)}
        style={styles.input}
      />
      <Button title="Save Changes" onPress={handleSaveChanges} color='sienna'/>
      <Button title="Cancle Editing" onPress={handleCancelEditing} color='sienna'/>
    </View>
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
    justifyContent: 'center',
    alignItems: 'center',
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

export default EditBook;