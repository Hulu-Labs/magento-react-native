import AsyncStorage from '@react-native-community/async-storage';
import { magento } from '../magento';
import { getCart,createCustomerCart  } from './RestActions';
// import { createCustomerCart  } from './Re';
import {
  MAGENTO_PASSWORD_RESET_LOADING,
  MAGENTO_PASSWORD_RESET_SUCCESS,
  MAGENTO_PASSWORD_RESET_ERROR,
  MAGENTO_CURRENT_CUSTOMER,
  MAGENTO_CREATE_CUSTOMER_LOADING,
  MAGENTO_CREATE_CUSTOMER_SUCCESS,
  MAGENTO_CREATE_CUSTOMER_ERROR,
  MAGENTO_AUTH_LOADING,
  MAGENTO_AUTH,
  MAGENTO_LOGOUT,
  MAGENTO_AUTH_ERROR,
  MAGENTO_LOGIN_SUCCESS,
} from './types';
import NavigationService from '../navigation/NavigationService';
import {
  NAVIGATION_ACCOUNT_STACK_PATH,
  NAVIGATION_LOGIN_STACK_PATH,
} from '../navigation/routes';
import { logError } from '../helper/logger';


export const signIn = customer => async dispatch => {
  try {
    dispatch({ type: MAGENTO_CREATE_CUSTOMER_LOADING, payload: true });
    const response = await magento.guest.createCustomer(customer);
    dispatch({ type: MAGENTO_CREATE_CUSTOMER_SUCCESS, payload: response });
    if (response.id && response.group_id) {
      const token = await magento.guest.auth(
        customer.customer.email,
        customer.password,
      );
      if (token.message) {
        authFail(dispatch, token.message);
      } else {

        dispatch({ type: MAGENTO_AUTH_LOADING, payload: false });

        authSuccess(dispatch, token);
      }
    } else if (response.message) {
      authFail(dispatch, response.message);
    } else {
      authFail(dispatch, 'Something went wrong. Pleas try again later.');
    }
  } catch (e) {
    logError(e);
    authFail(dispatch, e.message);
  }
};

export const auth = (username, password) => async dispatch => {
  try {
    // dispatch({ type: MAGENTO_AUTH_LOADING, payload: true });
    const response = await magento.guest.auth(username, password);
    console.log('token');
    magento.setCustomerToken(response);
    if (response.message) {
      authFail(dispatch, response.message);
    } else {
      authSuccess(dispatch, response);
      dispatch({ type: MAGENTO_LOGIN_SUCCESS });
      dispatch(getCart());
    }
  } catch (e) {
    logError(e);
    authFail(dispatch, e.message);
  }
};

const authSuccess = async (dispatch, token) => {
  dispatch({ type: MAGENTO_AUTH, payload: token });

  try {
    await AsyncStorage.setItem('customerToken', token);
    //dispatch({ type: MAGENTO_AUTH_LOADING, payload: false });
    dispatch(getCart());
    NavigationService.navigate(NAVIGATION_ACCOUNT_STACK_PATH);
    console.log("token here " + token);
  } catch (e) {
    logError(e);
    authFail(dispatch, 'Something went wrong. Pleas try again later.');
  }
};

const authFail = (dispatch, message) => {
  dispatch(errorMessage(message));
  dispatch({ type: MAGENTO_AUTH_LOADING, payload: false });
};

export const errorMessage = error => ({
  type: MAGENTO_AUTH_ERROR,
  payload: error,
});

export const logout = () => dispatch => {
  dispatch({ type: MAGENTO_AUTH, payload: '' });
  dispatch({ type: MAGENTO_LOGOUT });
  dispatch(getCart());
  NavigationService.navigate(NAVIGATION_LOGIN_STACK_PATH);
  AsyncStorage.setItem('customerToken', '');
  magento.setCustomerToken(false);
};

export const initiatePasswordReset = email => async dispatch => {
  try {
    dispatch({ type: MAGENTO_PASSWORD_RESET_LOADING, payload: true });
    await magento.guest.initiatePasswordReset(email);
    const message = `If there is an account associated with ${email} you will
        receive an email with a link to reset your password.`;
    dispatch({ type: MAGENTO_PASSWORD_RESET_SUCCESS, payload: message });
  } catch (e) {
    logError(e);
    dispatch({
      type: MAGENTO_PASSWORD_RESET_ERROR,
      payload: { errorMessage: e.message },
    });
  }
};

/**
 * This action will reset all the state varaibales related to
 * password_reset in the CustomerAuthReducer.
 */
export const updatePasswordResetUI = () => async dispatch => {
  dispatch({ type: MAGENTO_PASSWORD_RESET_LOADING, payload: false });
};

// store.dispatch(setCurrentCustomer(customer));
export const currentCustomer = () => async dispatch => {
  const customerToken = await AsyncStorage.getItem('customerToken');
  magento.setCustomerToken(customerToken);
 console.log("customerToken inside the currentCustomer() function ----------------------->"+ customerToken)
  if (customerToken) {
    try {
      const customer = await magento.customer.getCurrentCustomer();
      dispatch({
        type: MAGENTO_CURRENT_CUSTOMER,
        payload: customer,
      });
      // createCustomerCart();
      // dispatch(getCart());
      // const { customer } = getState().account;
        if (customer && customer.id) {
          dispatch(createCustomerCart(customer.id));
          dispatch(getCart());

        }
   
      console.log("customer is ----------------------------------->" + customer.firstname + " and customer id is " + customer.id);
    
    } catch (error) {
      console.log('unable to retrieve current customer', error);
      logError(error);
    }
  }else {
    console.log("login screen render");
    logout();
  }


 
};





export const currentCustomerT = () => async dispatch => {
  try {
    const customer = await magento.customer.getCurrentCustomer();
    dispatch({
      type: MAGENTO_CURRENT_CUSTOMER,
      payload: customer,
    });
    console.log("customer is ----------------------------------->" + customer.firstname);

  } catch (error) {
    logError(error);
  }
};

export const setCurrentCustomer = customer => ({
  type: MAGENTO_CURRENT_CUSTOMER,
  payload: customer,
});
