import React, { useState } from 'react';
import { View, Text, TextInput, Button,StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RadioButton } from 'react-native-paper';
const Buy = ({ navigation }) => {
    const [userInfo, setUserInfo] = useState({
      name: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      city: '',
      country: '',
      zipCode: '',
    });
  
    const [paymentMethod, setPaymentMethod] = useState('CreditCard'); 
    const [selectedBookIds, setSelectedBookIds] = useState([]);
    //remove all books from storage
    const handleBuyBooks = async () => {
      try {
        const userId = await AsyncStorage.getItem('userId');
        await AsyncStorage.removeItem(`selectedBookIds_${userId}`);
  
        alert("You buy books!")
        navigation.navigate('Home');
  
        setSelectedBookIds([]);
      } catch (error) {
        console.error('Error buying books:', error);
      }
    };
  
    return (
     <View style={styles.container}>
      <Text>Name:</Text>
      <TextInput
       placeholder="Enter your Name"
        onChangeText={(text) => setUserInfo({ ...userInfo, name: text })}
        value={userInfo.name} style={styles.input}
      />
      <Text>Last Name:</Text>
      <TextInput
       placeholder="Enter your Last Name"
        onChangeText={(text) => setUserInfo({ ...userInfo, lastName: text })}
        value={userInfo.lastName} style={styles.input}
      />
      <Text>Email:</Text>
      <TextInput
      placeholder="Enter your E-mail"
        onChangeText={(text) => setUserInfo({ ...userInfo, email: text })}
        value={userInfo.email} style={styles.input}
      />
      <Text>Phone Number:</Text>
      <TextInput
      placeholder="Enter your Phone Number"
        onChangeText={(text) => setUserInfo({ ...userInfo, phoneNumber: text })}
        value={userInfo.phoneNumber} style={styles.input}
        keyboardType="numeric"
      />
      <Text>City:</Text>
      <TextInput
      placeholder="Enter City where you living"
        onChangeText={(text) => setUserInfo({ ...userInfo, city: text })}
        value={userInfo.city} style={styles.input}
      />
      <Text>Country:</Text>
      <TextInput
      placeholder="Enter Country where you living"
        onChangeText={(text) => setUserInfo({ ...userInfo, country: text })}
        value={userInfo.country} style={styles.input}
      />
      <Text>Zip Code:</Text>
      <TextInput
      placeholder="Enter Zip Code"
        onChangeText={(text) => setUserInfo({ ...userInfo, zipCode: text })}
        value={userInfo.zipCode} style={styles.input}
        keyboardType="numeric"
      />
      <Text>Address:</Text>
      <TextInput
      placeholder="Enter your Address"
        onChangeText={(text) => setUserInfo({ ...userInfo, country: text })}
        value={userInfo.country} style={styles.input}
      />
  
        <Text>Select Payment Method:</Text>
        <RadioButton.Group
          onValueChange={(newValue) => setPaymentMethod(newValue)}
          value={paymentMethod}
        >
          <View>
            <Text>Cash on Delivery</Text>
            <RadioButton value="CashOnDelivery" color="sienna"/>
          </View>

          <View>
            <Text>Credit Card</Text>
            <RadioButton value="CreditCard" color="sienna"/>
          </View>
        </RadioButton.Group>
  
        {paymentMethod === 'CreditCard' && (
          <>
            <Text>Card Number:</Text>
            <TextInput
            placeholder="Enter your Card Number"
              onChangeText={(text) => setUserInfo({ ...userInfo, cardNumber: text })}
              value={userInfo.cardNumber} style={styles.input}
              keyboardType="numeric"
            />
  
            <Text>Expiry Date:</Text>
            <TextInput
            placeholder="Enter Expiry Date of Card"
              onChangeText={(text) => setUserInfo({ ...userInfo, expiryDate: text })}
              value={userInfo.expiryDate} style={styles.input}
              keyboardType="numeric"
            />
          </>
        )}
        <Button title="Buy Books" onPress={handleBuyBooks} color="sienna"/>
      </View>
    );
  };

  const styles = StyleSheet.create({
    container: {
      flex:1,
      backgroundColor:'bisque',
      padding: 20,
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
  
  export default Buy;