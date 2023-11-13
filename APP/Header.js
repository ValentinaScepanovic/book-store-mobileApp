import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const Header = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.navigate('Home')} style={styles.iconContainer}>
        <Icon name="home" size={30} style={styles.icon} />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Search')} style={styles.iconContainer}>
        <Icon name="search" size={30} style={styles.icon} />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Add New Book')} style={styles.centerIconContainer}>
        <Icon name="plus-circle" size={50} style={styles.centerIcon} />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Shopping Bag')} style={styles.iconContainer}>
        <Icon name="shopping-bag" size={30} style={styles.icon} />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Profile')} style={styles.iconContainer}>
        <Icon name="user" size={30} style={styles.icon} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: 'burlywood',
    paddingVertical: 10,
    elevation: 3,
  },
  iconContainer: {
    flex: 1,
    alignItems: 'center',
  },
  centerIconContainer: {
    flex: 1,
    alignItems: 'center',
  },
  icon: {
    color: 'black', 
  },
  centerIcon: {
    color: 'sienna',
  },
});

export default Header;