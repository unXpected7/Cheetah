import {
  Text,
  ScrollView,
  View,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import React, {Component} from 'react';
import {styles} from '../../styles/Register';
import axios from 'axios'

class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: 'jeki@test.com',
      password: 'jeki1234',
      nickname: 'Jeki',
    };
  }
   

  async register() {
    try {
      const {email,password,nickname} = this.state
      const data = {
        email:email,
        password:password,
        nickname:nickname
      }
      console.log('data to send',data)

      const response = await axios.post('http://192.168.1.6:3333/v1/register',data)
      console.log('response register',response.data.data)
    } catch (error) {
      console.log('error register',error)
    }
  }


  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.signUp}>Sign Up</Text>
        <ScrollView>
          <View>
            <Text style={styles.text}>Email</Text>
            <TextInput
              style={styles.input}
              onChangeText={email => this.setState({email})}></TextInput>
            <Text style={styles.text}>Nick Name</Text>
            <TextInput
              style={styles.input}
              onChangeText={nickname => this.setState({nickname})}></TextInput>
            <Text style={styles.text}>Password</Text>
            <TextInput
              style={styles.input}
              onChangeText={password => this.setState({password})}></TextInput>
            <Text style={styles.text}>Retype Password</Text>
            <TextInput style={styles.input}></TextInput>
          </View>
          <TouchableOpacity
            style={styles.button}
            onPress={() => this.register()}>
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
