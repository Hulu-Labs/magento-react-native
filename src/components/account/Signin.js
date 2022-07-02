import React, { useRef, useState, useContext } from 'react';
import { View, StyleSheet, Image, Dimensions, ScrollView } from 'react-native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Spinner, Button, Text, Input } from '../common';
import { signIn } from '../../actions';
import { theme, ThemeContext } from '../../theme';
import { translate } from '../../i18n';

// This file name should be Signup
const Signin = ({ loading, error_signup, success, signIn: _signIn }) => {
  const theme = useContext(ThemeContext);
  // Internal State
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isClicked, setIsClicked] = useState(false);

  // Reference
  const lastnameInput = useRef(null);
  const emailInput = useRef(null);
  const passwordInput = useRef(null);

  const onCreateAccountPress = () => {

    // TODO: add password validation check
    const customer = {
      customer: {
        email,
        firstname,
        lastname,
      },
      password,
      
    };
    // error= null;
    _signIn(customer);
  };
  
 
  const renderButtons = () => {
    if (loading) {
      return <Spinner />;
    }

    return (
      <Button
        disabled={
          firstname === '' || lastname === '' || email === '' || password === ''
        }
        onPress={onCreateAccountPress} >
        {translate('signup.createAccountButton')}
      </Button>
    );
  };

  const renderMessages = () => {
    if(firstname === '' || lastname === '' || email === '' || password === ''){
      if(error_signup){
        
        error_signup = ""
        return;
      }
    }
    
    
    if (error_signup) {
      return <Text style={styles.error(theme)}>{error_signup}</Text>;
    }

    if (success) {
      return <Text style={styles.success(theme)}>{success}</Text>;
    }
  };

  return (
    <ScrollView
    // onScroll={({nativeEvent}) => {
    //   if (isCloseToBottom(nativeEvent)) {
    //     enableSomeButton();
    //   }
    // }}
    // scrollEventThrottle={400}
  >
    <View style={styles.container(theme)}>
      <View style={styles.bigCircle}></View>
        <View style={styles.smallCircle}></View>
        <View style={styles.centerizedView}>
        <View style={styles.authBox(theme)}>
        <View style={styles.logoBox}>
            <Image source={require('../../../assets/logo.png')}  style={styles.logo}/>
              {/* <Icon
                color='#fff'
                name='comments'
                type='font-awesome'
                size={50}
              /> */}
            </View>
      <Input
        autoCapitalize="none"
        underlineColorAndroid="transparent"
        placeholder={translate('common.firstName')}
        returnKeyType="next"
        autoCorrect={false}
        value={firstname}
        editable={!loading}
        onChangeText={setFirstname}
        onSubmitEditing={() => {
          lastnameInput.current.focus();
        }}
        containerStyle={styles.inputContainer(theme)}
        name="user"
      />
      <Input
        autoCapitalize="none"
        underlineColorAndroid="transparent"
        placeholder={translate('common.lastName')}
        autoCorrect={false}
        returnKeyType="next"
        value={lastname}
        editable={!loading}
        onChangeText={setLastname}
        assignRef={input => {
          lastnameInput.current = input;
        }}
        onSubmitEditing={() => {
          emailInput.current.focus();
        }}
        containerStyle={styles.inputContainer(theme)}
        name="user"
      />
      <Input
        autoCapitalize="none"
        underlineColorAndroid="transparent"
        placeholder={translate('common.email')}
        keyboardType="email-address"
        returnKeyType="next"
        autoCorrect={false}
        value={email}
        editable={!loading}
        onChangeText={setEmail}
        assignRef={input => {
          emailInput.current = input;
        }}
        onSubmitEditing={() => {
          passwordInput.current.focus();
        }}
        containerStyle={styles.inputContainer(theme)}
        name="envelope-o"
      />
      <Input
        autoCapitalize="none"
        underlineColorAndroid="transparent"
        secureTextEntry
        placeholder={translate('common.password')}
        autoCorrect={false}
        value={password}
        editable={!loading}
        onChangeText={setPassword}
        assignRef={input => {
          passwordInput.current = input;
        }}
        onSubmitEditing={onCreateAccountPress}
        containerStyle={styles.inputContainer(theme)}
        name="lock"
      />
      {renderButtons()}
      {renderMessages()}
      </View>
      </View>
      {/* <View /> */}
    </View>
    </ScrollView>
  );
};

Signin.navigationOptions = {
  title: translate('signup.title'),
};

const styles = StyleSheet.create({
  container: theme => ({
    flex: 1,
    backgroundColor: theme.colors.background,
    alignItems: 'center',
    paddingTop: theme.dimens.WINDOW_HEIGHT * 0.1,
  }),
  inputContainer: theme => ({
    width: theme.dimens.WINDOW_WIDTH * 0.7,
    marginBottom: theme.spacing.large,
  }),
  error: theme => ({
    color: theme.colors.error,
    // width: theme.dimens.WINDOW_WIDTH * 0.85,
    textAlign: 'center',
    marginTop: theme.spacing.extraLarge,
  }),
  success: theme => ({
    color: theme.colors.success,
    width: theme.dimens.WINDOW_WIDTH * 0.85,
    textAlign: 'center',
    marginTop: theme.soacing.extraLarge,
  }),
  bigCircle: {
    width: Dimensions.get('window').height * 0.7,
    height: Dimensions.get('window').height * 0.7,
    backgroundColor: '#2CB4FB',
    borderRadius: 1000,
    position: 'absolute',
    right: Dimensions.get('window').width * 0.25,
    top: -50,
  },
  smallCircle: {
    width: Dimensions.get('window').height * 0.4,
    height: Dimensions.get('window').height * 0.4,
    backgroundColor: '#2CB4FB',
    borderRadius: 1000,
    position: 'absolute',
    bottom: Dimensions.get('window').width * -0.2,
    right: Dimensions.get('window').width * -0.3,
  },
  centerizedView: {
    width: '100%',
    // top: '15%',
    // left: '15%'
    justifyContent: 'center',
     alignSelf: 'center',
     
  },
  authBox:theme=>({
    width: '80%',
    backgroundColor: '#fafafa',
    borderRadius: 20,
    alignSelf: 'center',
    paddingHorizontal: 14,
    paddingBottom: 30,
    marginBottom:30,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    width: theme.dimens.WINDOW_WIDTH * 0.8,

    // bottom:10
  }),
  logo: {
    justifyContent: 'center',
    alignSelf: 'center',

   width:150,
   height:60,
   marginBottom:40,
  //  bottom:50
   top: 10
   
   },
  
});

Signin.propTypes = {
  loading: PropTypes.bool.isRequired,
  error_signup: PropTypes.oneOfType(PropTypes.string, null),
  success: PropTypes.oneOfType(PropTypes.string, null),
  signIn: PropTypes.func.isRequired,
};

Signin.defaultProps = {
  error_signup: null,
  success: null,
};

const mapStateToProps = ({ customerAuth }) => {
  const { error_signup, success, loading } = customerAuth;

  return { error_signup, success, loading };
};

export default connect(mapStateToProps, { signIn })(Signin);
