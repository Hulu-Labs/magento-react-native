import React, { Component } from 'react';
import { Alert, View, StyleSheet, TextInput, Dimensions, TouchableHighlight, Image } from 'react-native';
import { StackActions, NavigationActions } from 'react-navigation';
import { connect } from 'react-redux';
import {
  checkoutSelectedPaymentChanged,
  checkoutCustomerNextLoading,
  checkoutOrderPopupShown,
  placeGuestCartOrder,
  getCart,
  resetCart,
  checkoutSetActiveSection,
  removeCouponFromCart,
  addCouponToCart,
} from '../../actions';
import { NAVIGATION_HOME_STACK_PATH } from '../../navigation/routes';
import { Button, Spinner, Text, Price } from '../common';
import { ThemeContext } from '../../theme';
import { translate } from '../../i18n';
import { priceSignByCode } from '../../helper/price';
import { Row, Spacer } from 'react-native-markup-kit';
// import { Init, GetServiceProviders, MakeTransaction, checkPermission, GetTransactions, GetApps, CreateTransaction, CreateApp } from 'hulupay-core-rn';
import RadioForm from 'react-native-simple-radio-button';
import Modal from "react-native-modal";
import { convertToString } from '../../magento/utils/params';


const image = { uri: "https://reactjs.org/logo-og.png" };
class CheckoutTotals extends Component {

  static contextType = ThemeContext;
  _isMounted = false;

  state = {
    couponCodeInput: '',
    providers: [],
    selectedProvider: '',
    temp: null,
    temp2: null,
    permsGranted: false,
    gotSMSResponse: false,
    dialogVisible: false,
    modalVisible: false,
    acc_no: '',
    amount: '',
    reason: '',
    token: '',
    receiver: '',
    sender: ''




  };
  showDialog = () => {
    this.setState({ dialogVisible: true });
  };

  handleCancel = () => {
    this.setState({ dialogVisible: false });
  };

  handleDelete = () => {
    // The user has pressed the "Delete" button, so here you can do your own logic.
    // ...Your logic
    this.setState({ dialogVisible: false });
  };

  toggleModal(visible) {
    this.setState({ modalVisible: visible });
  }

  onPlacePressedOption1 = () => {
    const { cartId, selectedPayment, totals } = this.props;
    const payment = {
      paymentMethod: {
        // po_number: selectedPayment.code,
        method: selectedPayment.code,
        // additional_data: [
        // 	"string"
        // ],
        // extension_attributes: {
        // 	agreement_ids: [
        // 		"string"
        // 	]
        // }
      },

    };
    this.props.checkoutCustomerNextLoading(true);
    this.props.placeGuestCartOrder(cartId, payment);


  }

  onPlacePressed = () => {
    this.alertDialogBox();
  };
  updateInputVal = (val, prop) => {
    const state = this.state;
    state[prop] = val;
    this.setState(state);
  }


  goHome = () => {
    this.props.navigation.navigate(NAVIGATION_HOME_STACK_PATH);
  };

  renderTotals() {
    const {
      totals: {
        base_currency_code: baseCurrencyCode,
        base_subtotal: baseSubTotal,
        base_grand_total: grandTotal,
        base_shipping_incl_tax: shippingTotal,
      },
      baseCurrencySymbol,
      currencyCode,
      currencySymbol,
      currencyRate,
    } = this.props;


    return (
      <View style={styles.totalsStyle}>

        <View style={styles.row}>
          <Text>{`${translate('common.subTotal')}: `}</Text>
          <Price
            basePrice={baseSubTotal}
            currencySymbol={currencySymbol}
            currencyRate={currencyRate}
          />
        </View>
        {!!this.props?.totals?.coupon_code && (
          <View style={styles.row}>
            <Text>{`${translate('common.discount')}: `}</Text>
            <Price
              basePrice={this.props?.totals?.discount_amount}
              currencySymbol={currencySymbol}
              currencyRate={currencyRate}
            />
          </View>
        )}
        <View style={styles.row}>
          <Text>{`${translate('common.shipping')}: `}</Text>
          <Price
            basePrice={shippingTotal}
            currencySymbol={currencySymbol}
            currencyRate={currencyRate}
          />
        </View>
        <View style={styles.row}>
          <Text>{`${translate('common.total')}: `}</Text>
          <Price
            basePrice={grandTotal}
            currencySymbol={currencySymbol}
            currencyRate={currencyRate}
          />
        </View>
        {baseCurrencyCode !== currencyCode && (
          <View style={styles.row}>
            <Text>{`${translate('checkout.youWillBeCharged')}: `}</Text>
            <Price
              basePrice={grandTotal}
              currencySymbol={
                baseCurrencySymbol || priceSignByCode(baseCurrencyCode)
              }
              currencyRate={1}
            />
          </View>
        )}
      </View>
    );
  }

  renderButton() {
    const theme = this.context;
    const { payments } = this.props;

    let amount = convertToString(this.props.totals.base_grand_total);
    let receiver;
    // let reason = this.props.cartId;
    let reason = convertToString(this.props.cartId);
    console.log(this.props.cartId, "                        WHAT IS THE VALUE OF THE CART ID            ")

    if (!payments.length) {
      return <View />;
    }
    if (this.props.loading) {
      return (
        <View style={styles.nextButtonStyle}>
          <Spinner size="large" />
        </View>
      );
    }

    if (this.state.selectedProvider == 1 || this.state.selectedProvider == 2) {
      //  this.setState({sender: this.props.telephone})
      receiver = "1000370108898";                                     //  ***  Define account Number here ***
    }
    else if (this.state.selectedProvider == 3) {
      // this.setState({receiver: "1000134797618"})      
      receiver = "0931613977";
      console.log(receiver, " this is the telephone")
    }
    // let receiver = (this.state.selectedProvider == 5) ? "1000134797618" : this.props.telephone;
    return (
      <View style={styles.nextButtonStyle}>

        {this.props.selectedPayment.code === "banktransfer" && this.state.selectedProvider != null && this.state.permsGranted === true

          ?

          <Button
            onPress={(e) => {
              this.theMakeRequest(
                "WTWYQSPTTY", this.state.selectedProvider, amount,
                reason, receiver, this.state.token, this.props.telephone)
            }
            }
            disable={this.props.loading}
            style={styles.buttonStyle(theme)}>
            {translate('checkout.placeOrderButton')}

          </Button>

          :

          <Button
            onPress={this.onPlacePressedOption1}
            disable={this.props.loading}
            style={styles.buttonStyle(theme)}>
            {translate('checkout.placeOrderButton')}
          </Button>}

      </View>
    );
  }

  componentDidMount() {

    // **********************************

    // INITIALIZING -> GET TOKEN FROM THE SERVER
    // let init = Init('admin@hulupay.com', 'hulu-pay.pass');
    // init.then((res) => {
    //   this.setState({ token: res.access_token })

    //   let getServiceProviders = GetServiceProviders(res.access_token);
    //   // GET SERVICE PROVIDERS
    //   getServiceProviders.then((provider) => {
    //     console.log("PROVIDERS " + provider[0].name)
    //     this.setState({ providers: provider })
    //   }).catch((e) => {
    //     console.log("ERROR ERROR ERROR " + e)
    //   })

    // }).catch((e) => console.log(e));

    // // **********************************

    // this.checkPermission();


    if (this.props?.totals?.coupon_code) {
      this.setState({
        couponCodeInput: this.props?.totals?.coupon_code,
      });
    }


  }


  onProviderSelect = (value) => {

    this.setState({ selectedProvider: value });
    console.log(value + " you have selected the value id ")

  }

  componentDidUpdate(prevProps) {
    if (this.props.orderId && this.props.orderId !== prevProps.orderId) {
      this.showPopup(
        translate('common.order'),
        translate('checkout.orderSuccessMessage'),
      );
    }
    if (
      this.props.errorMessage &&
      this.props.errorMessage !== prevProps.errorMessage
    ) {
      this.showPopup(translate('errors.error'), this.props.errorMessage);
    }
    if (this.props?.totals?.coupon_code !== prevProps?.totals?.coupon_code) {
      this.setState({
        couponCodeInput: this.props?.totals?.coupon_code,
      });
    }
  }

  showPopup(title, message) {
    this.props.checkoutSetActiveSection(1);
    this.props.resetCart();
    // this.props.checkoutOrderPopupShown();
    Alert.alert(
      title,
      message,
      [{ text: translate('common.ok'), onPress: () => this.goHome() }],
      { cancelable: false },
    );
  }

  couponAction = () => {
    if (this.props?.totals?.coupon_code) {
      this.props.removeCouponFromCart();
    } else {
      this.props.addCouponToCart(this.state.couponCodeInput);
    }
  };

  renderCoupon = () => {
    const theme = this.context;

    return (
      <View>
        <View style={[styles.row, { justifyContent: 'space-between' }]}>
          <View style={styles.couponInputContainer(theme)}>
            <TextInput
              // style={{ width: '100%' }}
              editable={!this.props?.totals?.coupon_code}
              value={this.state.couponCodeInput}
              placeholder="Coupon Code"
              onChangeText={value => this.setState({ couponCodeInput: value })}
            />
          </View>
          <Spacer size={50} />
          {this.props.couponLoading ? (
            <View style={{ width: 100 }}>
              <Spinner />
            </View>
          ) : (
            <Button
              onPress={this.couponAction}
              style={{ width: 100, alignSelf: 'auto' }}>
              {this.props?.totals?.coupon_code ? 'Cancel' : 'Apply'}
            </Button>
          )}
        </View>
        {!!this.props.couponError?.length && (
          <Text style={{ color: 'red', marginBottom: 10, textAlign: 'center' }}>
            {this.props.couponError}
          </Text>
        )}
      </View>
    );
  };


  renderPaymentMethods = () => {
    // const { providers } = this.state;
    // if (this.props.selectedPayment.code === "banktransfer") {
    //   const radioProps = providers ? providers.map(provider => ({
    //     label: provider.name,
    //     value: provider.id,
    //   })) : <Text> Loading ... </Text>

    //   return (
    //     <RadioForm
    //       radio_props={radioProps}
    //       initial={0}
    //       animation={false}
    //       onPress={value => {
    //         this.onProviderSelect(value);
    //       }}
    //     />
    //   );
    // }


  }


  theMakeRequest = (app_code, serviceProvider_ID, amount, reason, receiver, token, sender) => {

    // let api = MakeTransaction(app_code, serviceProvider_ID, amount, reason, receiver, token, sender)

    // api
    //   .then(response => {
    //     this.setState({
    //       temp: response
    //     })
    //     if (typeof (this.state.temp) == 'undefined' || this.state.temp == false) {
    //       return;
    //     } else {
    //       this.onPlacePressedOption1()
    //     }

    //   })
    //   .catch(error => {
    //     console.log(error);
    //   });

  }

  getPermission = () => {
    // let api = getPermission();
    // api
    //   .then(response => {
    //     this.setState({
    //       permsGranted: true
    //     })

    //   })
    //   .catch(error => {
    //     console.log(error);
    //     this.setState({
    //       permsGranted: false
    //     })
    //   });

  }
  checkPermission = () => {
    // let api = checkPermission();
    // api
    //   .then(response => {
    //     this.setState({
    //       permsGranted: true
    //     })

    //   })
    //   .catch(error => {
    //     console.log(error);
    //     this.setState({
    //       permsGranted: false
    //     })
    //   });
  }


  render() {
    const theme = this.context;
    return (
      <View style={styles.container(theme)}>
        {this.renderPaymentMethods()}
        {this.renderCoupon()}
        {this.renderTotals()}
        {this.renderButton()}
      </View>
    );
  }
}

const styles = StyleSheet.create({

  container_modal: {
    alignItems: 'center',
    // backgroundColor: '#ede3f2',
    // padding: 100
  },
  input: {
    color: 'black'
  },
  modal: {
    flex: 1,
    alignItems: 'center',
    // backgroundColor: '',
    padding: 100
  },
  text: {
    color: '#3f2949',
    marginTop: 10
  },
  mainWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  container: theme => ({
    margin: theme.spacing.large,
    alignItems: 'flex-start',
  }),
  radioWrap: {
    alignItems: 'flex-start',
    alignSelf: 'flex-start',
  },
  nextButtonStyle: {
    flex: 1,
    alignSelf: 'center',
  },
  row: {
    flexDirection: 'row',
  },
  totalsStyle: {
    alignItems: 'flex-end',
    alignSelf: 'flex-end',
  },
  buttonStyle: theme => ({
    marginVertical: theme.spacing.large,
    alignSelf: 'center',
    width: theme.dimens.WINDOW_WIDTH * 0.9,
  }),
  couponInputContainer: theme => ({
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginBottom: 20,
    padding: 10,
    width: Dimensions.get('window').width - 100 - 30 - 50,
  }),
});

const mapStateToProps = ({ cart, checkout, magento }) => {
  const { cartId, couponLoading, couponError } = cart;
  const { loading, telephone } = checkout.ui;
  const { payments, selectedPayment, totals, orderId, errorMessage } = checkout;
  const {
    base_currency_symbol: baseCurrencySymbol,
    displayCurrencyCode: currencyCode,
    displayCurrencySymbol: currencySymbol,
    displayCurrencyExchangeRate: currencyRate,
  } = magento.currency;
  return {
    cartId,
    payments,
    selectedPayment,
    totals,
    loading,
    orderId,
    errorMessage,
    baseCurrencySymbol,
    currencyCode,
    currencySymbol,
    currencyRate,
    couponError,
    couponLoading,
    telephone,
  };
};

export default connect(mapStateToProps, {
  checkoutSelectedPaymentChanged,
  checkoutCustomerNextLoading,
  checkoutSetActiveSection,
  checkoutOrderPopupShown,
  placeGuestCartOrder,
  getCart,
  resetCart,
  addCouponToCart,
  removeCouponFromCart,
})(CheckoutTotals);
