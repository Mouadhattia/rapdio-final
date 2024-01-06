import React from 'react';
import {View, Text} from 'react-native';
import OTPInputView from '@twotalltotems/react-native-otp-input';

import {FONTS, SIZES, COLORS} from '../../constants';
import {FormInput, TextButton} from '../../components';
import {AuthLayout} from '../';
import {useDispatch} from 'react-redux';
import {
  resendVerificationCode,
  verifyRegistration,
} from '../../stores/auth/authActions';

const Otp = ({navigation, route}) => {
  const [timer, setTimer] = React.useState(60);
  const [verificationCode, setVerificationCode] = React.useState('');
  const [errMsg, setErrMsg] = React.useState('');
  const {phone} = route.params;
  const dispatch = useDispatch();
  React.useEffect(() => {
    let interval = setInterval(() => {
      setTimer(prevTimer => {
        if (prevTimer > 0) {
          return prevTimer - 1;
        } else {
          return prevTimer;
        }
      });
    }, 1000);

    // return a function for react to clean up
    //cleanup the interval
    return () => clearInterval(interval);
  }, []);
  const handleResndcode = () => {
    dispatch(resendVerificationCode({phone}));
    setTimer(60);
  };
  const handleVerficateCode = () => {
    dispatch(verifyRegistration({phone, verificationCode}))
      .then(() => {
        navigation.navigate('Home');
      })
      .catch(err => setErrMsg(err));
    setTimer(60);
  };
  return (
    <AuthLayout
      title="Code d'authentification"
      subtitle={"Un code d'authentification a été envoyé au " + phone}
      titleContainerStyle={{
        marginTop: SIZES.padding * 2,
      }}>
      <View
        style={{
          flex: 1,
          marginTop: SIZES.padding * 2,
        }}>
        {/* OTP */}
        <FormInput
          label="Code"
          //   secureTextEntry={!showPass}
          autoCompleteType="code"
          containerStyle={{
            marginTop: SIZES.radius,
          }}
          errorMsg={errMsg}
          value={verificationCode}
          onChange={value => {
            console.log(value);
            setVerificationCode(value);
          }}
        />

        {/* Countdown Timer */}
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            marginTop: SIZES.padding,
          }}>
          <Text style={{color: COLORS.darkGray, ...FONTS.body3}}>
            N'ai pas reçu le code.
          </Text>
          <TextButton
            label={`Renvoyer (${timer}s)`}
            disabled={timer == 0 ? false : true}
            buttonContainerStyle={{
              marginLeft: SIZES.base,
              backgroundColor: null,
            }}
            labelStyle={{
              color: COLORS.primary,
              ...FONTS.h3,
            }}
            onPress={() => handleResndcode()}
          />
        </View>
      </View>

      {/* Continue Button */}
      <View>
        <TextButton
          label="Continue"
          buttonContainerStyle={{
            height: 50,
            alignItems: 'center',
            borderRadius: SIZES.radius,
            backgroundColor: COLORS.primary,
          }}
          // onPress={() => navigation.replace('Home')}

          onPress={() => handleVerficateCode()}
        />
        <View style={{marginTop: SIZES.padding, alignItems: 'center'}}>
          <Text style={{...FONTS.body3, color: COLORS.darkGray}}>
            En vous inscrivant, vous acceptez nos
          </Text>
          <TextButton
            label="conditions générales d'utilisation."
            buttonContainerStyle={{
              backgroundColor: null,
            }}
            labelStyle={{
              color: COLORS.primary,
              ...FONTS.body3,
            }}
            onPress={() => console.log('tnc')}
          />
        </View>
      </View>
    </AuthLayout>
  );
};

export default Otp;
