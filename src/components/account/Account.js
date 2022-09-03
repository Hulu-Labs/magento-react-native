import React, { useEffect, useContext } from 'react';
import { connect } from 'react-redux';
import { View, StyleSheet, ActivityIndicator, Image, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';
import { Button, Text } from '../common';
import { logout, currentCustomer, currentCustomerT } from '../../actions';
import Icon from 'react-native-vector-icons/FontAwesome';

import {
  NAVIGATION_ORDERS_PATH,
  NAVIGATION_ADDRESS_SCREEN_PATH,
} from '../../navigation/routes';
import { ThemeContext } from '../../theme';
import { translate } from '../../i18n';

const Account = ({
  customer,
  navigation,
  currentCustomer: _currentCustomer,
  logout: _logout,
}) => {
  const theme = useContext(ThemeContext);

  useEffect(() => {
    // ComponentDidMount
    if (!customer) {
      _currentCustomer();
    }

  }, [_currentCustomer, customer]);

  const onLogoutPress = () => {
    _logout();
  };

  const renderCustomerData = () => {
    if (!customer) {
      return (
        <ActivityIndicator
          size="large"
          color={theme.colors.secondary}
          style={styles.activity(theme)}
        />
      );
    }

    const { email, firstname, lastname } = customer;
    return (
      <View style={styles.textContainer(theme)}>
        <View style={styles.imageContainer}>
          <Image source={require('../../../assets/profile-icon-png-915.png')} style={styles.logo} />

        </View>
        <Text bold type="subheading" style={styles.center}>
          {translate('account.contactInformation')}
        </Text>
        <View
          style={{
            borderBottomColor: 'black',
            borderBottomWidth: StyleSheet.hairlineWidth,
            marginBottom: 30

          }}
        />
        <View style={styles.containerStyle(theme)}>
          <Icon style={styles.inputIcon} name={"user"} size={25} color="#2CB4FB" />

          <Text style={styles.center}>

            {firstname} {lastname}
          </Text>
        </View>

        <View style={styles.containerStyle(theme)}>
          <Icon style={styles.inputIcon} name={"envelope-o"} size={25} color="#2CB4FB" />

          <Text style={styles.center}>

            {email}
          </Text>
        </View>


      </View>
    );
  };

  const openOrders = () => {
    navigation.navigate(NAVIGATION_ORDERS_PATH);
  };

  const openAddAddress = () => {
    navigation.navigate(NAVIGATION_ADDRESS_SCREEN_PATH);
  };

  return (
    <View style={styles.container(theme)}>
      {renderCustomerData()}

      <View style={{ "left": -74 }}>
        <View style={styles.containerStyle(theme)}>
          <Icon style={styles.inputIcon} name={"home"} size={25} color="#2CB4FB" />

          <TouchableOpacity onPress={openAddAddress}>
            <Text style={styles.buttons}> {translate('account.myAddressButton')}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.containerStyle(theme)}>
          <Icon style={styles.inputIcon} name={"shopping-basket"} size={25} color="#2CB4FB" />

          <TouchableOpacity onPress={openOrders}>

            <Text style={styles.buttons}> {translate('account.myOrdersButton')}</Text>
          </TouchableOpacity>
        </View>

      </View>

      <View style={{ top: 120 }}>
        <View style={styles.containerStyle(theme)}>
          <Icon style={styles.inputIcon} name={"power-off"} size={25} color="#2CB4FB" />

          <TouchableOpacity onPress={onLogoutPress}>

            <Text style={styles.buttons}>{translate('account.logoutButton')}</Text>
          </TouchableOpacity>
        </View>
      </View>



      {/* 
          Orginal Bottom Buttons on profile screen

          <Button onPress={openAddAddress} >
          <Icon  style={styles.inputIcon} name={"car"} size={25} color="#2CB4FB" /> 

            {translate('account.myAddressButton')}
          </Button>
              
          <Button onPress={openOrders} style={styles.buttonMargin(theme)}>
            {translate('account.myOrdersButton')}
          </Button>

          <Button onPress={onLogoutPress}  style={styles.buttonMargin(theme)}>
            {translate('account.logoutButton')}
          </Button> 
        
      */}

    </View>
  );
};

Account.navigationOptions = {
  title: translate('account.title'),
};

const styles = StyleSheet.create({
  containerStyle: theme => ({
    height: theme.dimens.defaultInputBoxHeight,
    // backgroundColor: theme.colors.surface,
    // borderWidth: 1,
    // borderColor: theme.colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 15,
    // paddingBottom: 10
    // flex:1
  }),
  container: theme => ({
    flex: 1,
    // backgroundColor: theme.colors.background,
    backgroundColor: theme.colors.lightGrey,
    alignItems: 'center',
    paddingTop: theme.spacing.large,
  }),
  activity: theme => ({
    padding: theme.spacing.large,
  }),
  center: {
    textAlign: 'center',
    fontSize: 19,
    fontWeight: "900",
    color: "black",

  },
  buttons: {
    fontSize: 15,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: "900",
    color: "grey",
  },
  buttonLogout: {
    // paddingBottom: 
  },
  textContainer: theme => ({
    marginBottom: theme.spacing.large,
  }),
  buttonMargin: theme => ({
    marginTop: theme.spacing.large,
  }),
  imageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 10
  },
  logo: {
    width: 300,
    height: 300,
  },
  inputIcon: {

    padding: 10,
    height: 50,
  }

});

Account.propTypes = {
  customer: PropTypes.object,
  navigation: PropTypes.object.isRequired,
  currentCustomer: PropTypes.func.isRequired,
  logout: PropTypes.func.isRequired,
};

Account.defaultProps = {
  customer: null,
};

const mapStateToProps = ({ account }) => {
  const { customer } = account;
  return { customer };
};

export default connect(mapStateToProps, { logout, currentCustomer })(Account);
