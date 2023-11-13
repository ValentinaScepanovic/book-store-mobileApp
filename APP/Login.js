import React, { useState } from 'react';
import { View, Text, TextInput, ImageBackground, StyleSheet, Button, Image } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Login = ({ navigation }) => {
  const [userName, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const signIn = () => {
    navigation.navigate('Sign In');
  };

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://192.168.8.100:3000/login', {
        userName: userName,
        password: password,
      });

      if (response.data.token) {
        await AsyncStorage.setItem('token', response.data.token);
        await AsyncStorage.setItem('userId', response.data.userId);
        navigation.navigate('Home');
        setUsername('');
        setPassword('');
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Invalid userName or password. Try again!');
    }
  };

  return (
    <ImageBackground
      source={require('./assets/pocetna.jpg')}
      style={styles.background}
    >
    <View style={styles.container}>
      <Text style={styles.title}>BookStore</Text>
      <Text style={styles.label}>Username</Text>
      <TextInput
        placeholder="Enter your username"
        onChangeText={(text) => setUsername(text)} 
        style={styles.input}
        value={userName}
      />
      <Text style={styles.label}>Password</Text>
      <TextInput
        placeholder="Enter your password"
        onChangeText={(text) => setPassword(text)}
        secureTextEntry
        style={styles.input}
        value={password}
      />
      <Button title="Login" onPress={handleLogin} color="sienna" />
      <Text>If you don't have an account, first Sign in!</Text>
      <Button title="Sign In" onPress={signIn} color="sienna" />
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
  title: {
    fontSize: 32, 
    fontWeight: 'bold',
    marginBottom: 40,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    width: 200,
    height: 40,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: '#ccc',
    paddingHorizontal: 10,
    marginBottom: 10,
    backgroundColor: 'white',
  },
});

export default Login;