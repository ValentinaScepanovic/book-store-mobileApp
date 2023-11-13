import React, { useState } from 'react';
import { ScrollView,View, Text, TextInput, Button, StyleSheet,ImageBackground } from 'react-native';
import axios from 'axios';

const SignIn = ({ navigation }) => {
  const [name, setName] = useState('');
  const [lastName, setLastName] = useState('');
  const [mail, setMail] = useState('');
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');

  const login = () => {
    navigation.navigate('Login'); 
  };

  const handleSignIn = async () => {
    try {
      const response = await axios.post('http://192.168.8.100:3000/signin', {
        name:name,
        lastName:lastName,
        mail:mail,
        userName: userName,
        password: password,
      });
  
      if (response.status === 201) {
        alert('Registration successful. Please log in.');
        navigation.navigate('Login'); 
      } else if (response.status === 409) {
        alert('User already exists. Please choose a different username.');
      } else {
        alert('An error occurred during registration');
      }
    } catch (error) {
      console.error('Registration error:', error);
      alert('An error occurred during registration');
    }
  };
  return (
      <ImageBackground
      source={require('./assets/pocetna.jpg')}
      style={styles.background}
    >
    <View style={styles.container}>
      <Text style={styles.label}>Name</Text>
      <TextInput
        style={styles.input}
        onChangeText={(text) => setName(text)}
        value={name}
        placeholder="Enter your name"
      />
      <Text style={styles.label}>Last Name</Text>
      <TextInput
        style={styles.input}
        onChangeText={(text) => setLastName(text)}
        value={lastName}
        placeholder="Enter your last name"
      />
      <Text style={styles.label}>E-mail</Text>
      <TextInput
        style={styles.input}
        onChangeText={(text) => setMail(text)}
        value={mail}
        placeholder="Enter your E-mail"
      />
      <Text style={styles.label}>Username</Text>
      <TextInput
        style={styles.input}
        onChangeText={(text) => setUserName(text)}
        value={userName}
        placeholder="Enter your username"
      />
      <Text style={styles.label}>Password</Text>
      <TextInput
        style={styles.input}
        onChangeText={(text) => setPassword(text)}
        value={password}
        placeholder="Enter your password"
        secureTextEntry={true}
      />
      <Button title="Sign in" onPress={handleSignIn} color="sienna"/>
      <Text>If you have account, log in!</Text>
      <Button title="Login" onPress={login} color="sienna"/>
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
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    width: 200,
    height: 40,
    backgroundColor:'white',
    borderWidth: 1,
    borderRadius: 10,
    borderColor: '#ccc',
    paddingHorizontal: 10,
    marginBottom: 20,
    marginLeft:20,
    marginRight:20
  },
});

export default SignIn;