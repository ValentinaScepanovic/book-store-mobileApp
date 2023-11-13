import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Login from './Login';
import SignIn from './SignIn';
import Home from './Home';
import Search from './Search';
import AddBook from './AddBook';
import ShoppingBag from './ShoppingBag';
import Buy from './Buy';
import Profile from './Profile';
import EditBook from './EditBook';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Sign In" component={SignIn} />
        <Stack.Screen name="Home" component={Home}/>
        <Stack.Screen name="Search" component={Search}/>
        <Stack.Screen name="Add New Book" component={AddBook}/>
        <Stack.Screen name="Shopping Bag" component={ShoppingBag}/>
        <Stack.Screen name ="Buy" component={Buy}/>
        <Stack.Screen name ="Profile" component={Profile}/>
        <Stack.Screen name ="Edit Book" component={EditBook}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
};
export default App;