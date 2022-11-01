import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator
} from 'react-native';
import React, {Component} from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import {styles} from '../../styles/Login';
import axios from "axios";

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email : '',
      password : '',
      loading : false
    }
  }
  async login() {
    this.setState({loading : true})
    try {
      const {email,password} = this.state
      const data = {
        email:email,
        password:password
      }
      console.log("this is data", data);

      const response = await axios.post('http://192.168.1.6:3333/v1/login',data)
      console.log('response login',response.data.data)
      this.setState({loading : false})
      this.props.navigation.replace("Chatroom")
    }
    catch (error) {
      console.log('error login',error)
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <Icon name="chatbox-ellipses-outline" style={styles.icon} />
        <ScrollView>
          <View style={styles.inputView}>
            <Text style={styles.text}>Email</Text>
            <TextInput style={styles.input} autoCapitalize="none" onChangeText={email => this.setState({email})} ></TextInput>
            <Text style={styles.text}>Password</Text>
            <TextInput style={styles.input} secureTextEntry={true} onChangeText={password => this.setState({password})} ></TextInput>
          </View>
          <TouchableOpacity
            style={styles.button}
            onPress={() => this.props.navigation.replace('Chatroom')}>
              {this.state.loading ? (
                <ActivityIndicator size={30} color="#FFFFFF" />
              ) : (
                 <Text style={styles.buttonText} onPress={() => this.login()} >Sign In</Text> 
              )}
            
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
