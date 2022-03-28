import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import React, {Component} from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import {styles} from '../../styles/Login';

class Login extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Icon name="chatbox-ellipses-outline" style={styles.icon} />
        <ScrollView>
          <View style={styles.inputView}>
            <Text style={styles.text}>Email</Text>
            <TextInput style={styles.input}></TextInput>
            <Text style={styles.text}>Password</Text>
            <TextInput style={styles.input} secureTextEntry={true}></TextInput>
          </View>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Sign In</Text>
          </TouchableOpacity>
          <View style={styles.optionView}>
            <Text style={styles.optionText}>Don’t Have an Account ? </Text>
            <TouchableOpacity
              onPress={() => this.props.navigation.replace('Register')}>
              <Text style={styles.optionButton}>Sign Up !</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    );
  }
}

export default Login;
