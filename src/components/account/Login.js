import React, { useState, useContext, useRef, Component } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
  Image,
  ScrollView
} from 'react-native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Spinner, Button, Input, Text } from '../common';
import { auth } from '../../actions/CustomerAuthActions';
import {
  NAVIGATION_SIGNIN_PATH,
  NAVIGATION_RESET_PASSWORD_PATH,
} from '../../navigation/routes';
import { ThemeContext } from '../../theme';
import { translate } from '../../i18n';
import Icon from 'react-native-vector-icons/FontAwesome';


const Login = ({ loading, error_login, success, navigation, auth: _auth }) => {

  
  
  
  const theme = useContext(ThemeContext);
  // Internal State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isClicked, setIsClicked] = useState(false);
  // Reference
  const passwordInput = useRef();

  const onLoginPress = () => {
    _auth(email, password);
  };
  const onSigninPress = () => {
    navigation.navigate(NAVIGATION_SIGNIN_PATH);
  };

  const passwordForget = () => {
    navigation.navigate(NAVIGATION_RESET_PASSWORD_PATH);
  };

  const renderButtons = () => {
    if (loading) {
      return <Spinner style={{ marginTop: 30 }} />;
    }

    return (
      <View>
        <Button
          disabled={email === '' || password === ''}
          style={styles.loginMargin(theme)}
          onPress={onLoginPress}>
          {translate('login.loginButton')}
        </Button>
        <Button onPress={onSigninPress} style={styles.buttonMargin(theme)}>
          {translate('login.signupButton')}
        </Button>
        <TouchableOpacity onPress={passwordForget} style={styles.link(theme)}>
          <Text style={styles.linkTitle}>
            {translate('login.forgetPassword')}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };
  

  const renderMessages = () => {
    
    if(email === '' || password === ''){
      if(error_login){
        
        error_login = "";
        return;
      }
    }
    
    if(error_login){
      return <Text style={styles.error(theme)}>
      {error_login} 
     
      </Text>;
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
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : null}
      style={styles.container(theme)}>
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

      {/* <Icon style={styles.searchIcon} name="ios-search" size={20} color="#000"/> */}
      {/* <View style={styles.searchSection}>

     <Icon style={styles.searchIcon} name="envelope-o" size={30} color="#2CB4FB" />  */}
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
        onSubmitEditing={() => passwordInput.current.focus()}
        containerStyle={styles.inputContainer(theme)}
        textContentType="emailAddress"
        name="envelope-o"
      />
      {/* </View> */}
      {/* <View style={styles.searchSection}>

<Icon style={styles.searchIcon} name="lock" size={30} color="#2CB4FB" />  */}

      <Input
        autoCapitalize="none"
        underlineColorAndroid="transparent"
        secureTextEntry
        placeholder={translate('common.password')}
        autoCorrect={false}
        value={password}
        editable={!loading}
        onChangeText={setPassword}
        onSubmitEditing={onLoginPress}
        assignRef={input => {
          passwordInput.current = input;
        }}
        containerStyle={styles.inputContainer(theme)}
        textContentType="password"
        name="lock"
      />
      {/* </View> */}
      {renderButtons()}
      {renderMessages()}
      </View>
      </View>
    </KeyboardAvoidingView>
    </ScrollView>
  );
};

Login.navigationOptions = {
  title: translate('login.title'),
};

const styles = StyleSheet.create({
  container: theme => ({
    flex: 1,
    backgroundColor: theme.colors.background,
    alignItems: 'center',
    paddingTop: theme.dimens.WINDOW_HEIGHT * 0.1,
    justifyContent: 'center',
    alignSelf: 'center',
  }),
  inputContainer: theme => ({
    width: theme.dimens.WINDOW_WIDTH * 0.7,
    marginBottom: theme.spacing.large,

    // flex: 1,
    // paddingTop: 10,
    // paddingRight: 10,
    // paddingBottom: 10,
    // paddingLeft: 0,
    // backgroundColor: '#fff',
    // color: '#424242',
  }),
  searchSection: {
    // flex: 1,
    flexDirection: 'row',
    // justifyContent: 'center',
    // alignItems: 'center',
    // backgroundColor: '#fff',
  //   borderBottomWidth: 1,
  // borderColor: '#000',
  paddingBottom: 10,
  
},
searchIcon: {
    padding: 10,
},
  loginMargin: theme => ({
    // marginTop: theme.spacing.large,
    // backgroundColor: theme.colors.test,
    // borderColor: theme.colors.test
    // backgroundColor: theme.colors.background
  }),
  buttonMargin: theme => ({
    marginTop: theme.spacing.large,
    backgroundColor: theme.colors.test,
    borderColor: theme.colors.test
    // backgroundColor: theme.colors.background
  }),
  error: theme => ({
    color: theme.colors.error,
    // width: theme.dimens.WINDOW_WIDTH * 0.83,
    textAlign: 'center',
    marginTop: theme.spacing.large,
  }),
  success: theme => ({
    // width: theme.dimens.WINDOW_WIDTH * 0.85,
    color: theme.colors.success,
    textAlign: 'center',
    marginTop: theme.spacing.extraLarge,
  }),
  link: theme => ({
    marginTop: theme.spacing.extraLarge,
  }),
  linkTitle: {
    textAlign: 'center',
  },
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
  authBox: theme =>({
    // width: '80%',
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
    // height:theme.dimens.WINDOW_HEIGHT * 0.8

  }),
  // logoBox: {
  //   width: 100,
  //   height: 100,
  //   backgroundColor: '#b0e2ff	',
  //   borderRadius: 1000,
  //   alignSelf: 'center',
  //   display: 'flex',
  //   alignItems: 'center',
  //   justifyContent: 'center',
  //   top: -50,
  //   marginBottom: -50,
  //   shadowColor: '#000',
  //   shadowOffset: {
  //     width: 0,
  //     height: 1,
  //   },
  //   shadowOpacity: 0.2,
  //   shadowRadius: 1.41,
  //   elevation: 2,
  // },
  // bigCircle: theme => ({
  //   width: theme.dimens.WINDOW_WIDTH  * 0.7,
  //   height:theme.dimens.WINDOW_HEIGHT * 0.7,
  //   backgroundColor: theme.colors.customColor1,
  //   borderRadius: 1000,
  //   position: 'absolute',
  //   right: theme.dimens.WINDOW_WIDTH  * 0.25,
  //   top: -50,
  // }),
  // smallCircle: theme => ({
  //   width: Dimensions.get('window').height * 0.4,
  //   height: Dimensions.get('window').height * 0.4,
  //   backgroundColor: theme.colors.customColor2,
  //   borderRadius: 1000,
  //   position: 'absolute',
  //   bottom: Dimensions.get('window').width * -0.2,
  //   right: Dimensions.get('window').width * -0.3,
  // }),

  
  // logoBox: theme =>({
  //   width: 100,
  //   height: 100,
  //   backgroundColor: theme.colors.customColor4,
  //   borderRadius: 1000,
  //   alignSelf: 'center',
  //   display: 'flex',
  //   alignItems: 'center',
  //   justifyContent: 'center',
  //   top: -50,
  //   marginBottom: -50,
  //   shadowColor: '#000',
  //   shadowOffset: {
  //     width: 0,
  //     height: 1,
  //   },
  //   shadowOpacity: 0.2,
  //   shadowRadius: 1.41,
  //   elevation: 2,
  // }),
  logo: {
     justifyContent: 'center',
     alignSelf: 'center',

    width:150,
    height:60,
    // top: -30
    marginBottom:40,
  //  bottom:50
   top: 10
    
    },
  
});

const mapStateToProps = ({ customerAuth }) => {
  const { error_login, success, loading } = customerAuth;

  return { error_login, success, loading };
};

Login.propTypes = {
  loading: PropTypes.bool,
  error_login: PropTypes.oneOfType(PropTypes.string, null),
  success: PropTypes.oneOfType(PropTypes.string, null),
  auth: PropTypes.func.isRequired,
};

Login.defaultProps = {
  error_login: null,
  success: null,
  loading: false,
};

export default connect(mapStateToProps, { auth,})(Login);
