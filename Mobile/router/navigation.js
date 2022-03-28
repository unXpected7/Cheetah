import React, {Component} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {NavigationContainer} from '@react-navigation/native';
import Register from '../src/screen/Register';
import Login from '../src/screen/Login';
import Chatroom from '../src/screen/Chatroom';

const Stack = createNativeStackNavigator();
class Navigation extends Component {
  render() {
    return (
      <NavigationContainer>
        <Stack.Navigator screenOptions={{headerShown: false}}>
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="Register" component={Register} />
          <Stack.Screen name="Chatroom" component={Chatroom} />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
}
export default Navigation;
