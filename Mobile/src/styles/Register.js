import {StyleSheet} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: wp('10%'),
  },
  signUp: {
    fontFamily: 'Montserrat-Bold',
    fontSize: hp('6%'),
    marginVertical: hp('10%'),
    color: '#000000',
  },
  text: {
    fontFamily: 'Montserrat-Bold',
    fontSize: hp('2%'),
    color: '#000000',
  },
  input: {
    borderBottomWidth: hp('0.2%'),
    borderBottomColor: '#9B51E0',
    height: hp('5%'),
    marginBottom: hp('3%'),
  },
  button: {
    backgroundColor: '#2F80ED',
    alignSelf: 'center',
    height: hp('8%'),
    width: wp('80%'),
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: hp('4%'),
    borderRadius: 12,
    borderBottomWidth: 1,
    borderLeftWidth: 0.8,
    borderRightWidth: 0.8,
    borderColor: '#888888',
  },
  buttonText: {
    color: '#FFFFFF',
    fontFamily: 'Montserrat-Bold',
    fontSize: hp('2.5%'),
  },
  optionView: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  optionText: {
    fontFamily: 'Montserrat-Regular',
    fontSize: hp('2.5%'),
  },
  optionButton: {
    color: '#2F80ED',
    fontFamily: 'Montserrat-Bold',
    fontSize: hp('2.5%'),
  },
});
