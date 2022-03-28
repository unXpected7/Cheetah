import {
  Text,
  View,
  TextInput,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import React, {Component} from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import {styles} from '../../styles/Chatroom';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

class Chatroom extends Component {
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <View>
            <Icon name="people" size={hp('4.5%')} color="#FFFFFF" />
            <Text style={styles.online}>50 users online</Text>
          </View>
          <TouchableOpacity>
            <Icon name="ellipsis-vertical" size={hp('4.5%')} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
        <ScrollView></ScrollView>
        <View style={styles.inputView}>
          <TouchableOpacity>
            <Icon name="link-outline" size={hp('4.5%')} color="#888888" />
          </TouchableOpacity>
          <TextInput
            placeholder="Message"
            multiline={true}
            style={styles.input}></TextInput>
          <TouchableOpacity>
            <Icon name="send" size={hp('4%')} color="#888888" />
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}
export default Chatroom;
