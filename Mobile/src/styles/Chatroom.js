import {StyleSheet} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    backgroundColor: '#2F80ED',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: hp('8.5%'),
    width: wp('100%'),
    paddingHorizontal: wp('5%'),
    position: 'absolute',
    top: hp('0%'),
  },
  online: {
    color: '#FFFFFF',
    fontFamily: 'Montserrat-Bold',
    fontSize: hp('1.5%'),
  },
  inputView: {
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: hp('8.5%'),
    width: wp('100%'),
    paddingHorizontal: wp('5%'),
    borderTopWidth: 1,
    borderColor: '#888888',
    position: 'absolute',
    bottom: hp('0%'),
  },
  input: {
    height: hp('8%'),
    width: wp('70%'),
  },
});
