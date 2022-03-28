import {
  Text,
  ScrollView,
  View,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import React, {Component} from 'react';
import {styles} from '../../styles/Register';

class Register extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.signUp}>Sign Up</Text>
        <ScrollView>
          <View>
            <Text style={styles.text}>Email</Text>
            <TextInput style={styles.input}></TextInput>
            <Text style={styles.text}>Nick Name</Text>
            <TextInput style={styles.input}></TextInput>
            <Text style={styles.text}>Password</Text>
            <TextInput style={styles.input} secureTextEntry={true}></TextInput>
            <Text style={styles.text}>Retype Password</Text>
            <TextInput style={styles.input} secureTextEntry={true}></TextInput>
          </View>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Sign Up</Text>
          </TouchableOpacity>
          <View style={styles.optionView}>
            <Text style={styles.optionText}>Already Have an Account ? </Text>
            <TouchableOpacity
              onPress={() => this.props.navigation.replace('Login')}>
              <Text style={styles.optionButton}>Sign In !</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    );
  }
}

export default Register;
