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
import { Init, GetServiceProviders, MakeTransaction,checkPermission, GetTransactions, GetApps, CreateTransaction, CreateApp } from 'hulupay-core-rn';
import RadioForm from 'react-native-simple-radio-button';
import Modal from "react-native-modal";
import { convertToString  } from '../../magento/utils/params';


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
    token:'',
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

  alertDialogBox = () => {
    return (
      <View style = {styles.container_modal}>
      <Modal animationType = {"slide"} transparent = {false}
         visible = {this.state.modalVisible}
         onRequestClose = {() => { console.log("Modal has been closed.") } }>
         
         <View style = {styles.modal}>
               <Text style = {styles.text}>Please Fill the required information
                  to pay through CBE!
                  </Text>

                  <TextInput
                style={styles.first_name}
                placeholder='Account Number'
                autoCapitalize="none"
                placeholderTextColor='orange'
                value={this.state.acc_no}
                onChangeText={(val) => this.updateInputVal(val, 'acc_no')}/>

             
            
            <TouchableHighlight onPress = {() => {
              // let amount = convertToString(this.props.totals.base_grand_total);
              let reason = convertToString(this.props.cartId);
              let amount = "1";
              //  this.theMakeRequest(this.state.acc_no, amount, reason)
              // MakeTransaction(app_code, serviceProvider_ID, amount, reason,  receiver, token)
              this.theMakeRequest("JAXIUYKL", 1, amount, reason, "1000134797618", this.state.token)
              

               }}>
               
               <Text style = {styles.text}>Confirm</Text>
            </TouchableHighlight>

            <TouchableHighlight onPress = {() => {
               this.toggleModal(!this.state.modalVisible)}}>
               
               <Text style = {styles.text}>Cancel</Text>
            </TouchableHighlight>
         </View>
      </Modal>
      
      {/* <TouchableHighlight onPress = {() => {this.toggleModal(true)}}>
         <Text style = {styles.text}>Open Modal</Text>
      </TouchableHighlight> */}
   </View>
    )

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
                  let amount = convertToString(this.props.totals.base_grand_total);
                  let receiver;
                  let reason = this.props.cartId;
     if(this.state.selectedProvider == 2){
      //  this.setState({sender: this.props.telephone})
      receiver = "1000139140188";                                     //  ***  Define account Number here ***

     }
     else if(this.state.selectedProvider == 6){
      // this.setState({receiver: "1000134797618"})
      
      receiver = "0931613977";
      console.log(receiver, " this is the telephone")

     }
      // let receiver = (this.state.selectedProvider == 5) ? "1000134797618" : this.props.telephone;
    return (
      <View style={styles.nextButtonStyle}>
      
    {this.props.selectedPayment.code === "banktransfer" && this.state.selectedProvider != null && this.state.permsGranted === true 
    ? <Button
    // onPress={() => {this.toggleModal(true)}}
    // theMakeRequest = (app_code, serviceProvider_ID, amount, reason, receiver, token) => {
      // JAXIUYKL
  
    onPress={(e)=>{              this.theMakeRequest("WTWYQSPTTY", this.state.selectedProvider, amount, reason,receiver , this.state.token, "0987654321")
  }}
    disable={this.props.loading}
    style={styles.buttonStyle(theme)}>
    {translate('checkout.placeOrderButton')}
    
  </Button>
  
    :  <Button
    onPress={this.onPlacePressedOption1}
    disable={this.props.loading}
    style={styles.buttonStyle(theme)}>
    {translate('checkout.placeOrderButton')}
  </Button>}
  {this.alertDialogBox()}

       
{/* <DialogInput isDialogVisible={this.state.dialogVisible}
            title={"DialogInput 1"}
            message={"Message for DialogInput #1"}
            hintInput ={"HINT INPUT"}
            submitInput={ (inputText) => {this.sendInput(inputText)} }
            closeDialog={ () => {this.showDialog(false)}}>
</DialogInput> */}
      </View>
    );
  }

  componentDidMount() {
    // this._isMounted = true;
    // let api = getListofServiceProviders();
    // api
    //   .then(response => {
    //     if (this._isMounted) {
    //     console.log('getting data from axios', response);
    //     this.setState({
    //       providers: response
    //     })
    //   }
    //   })
    //   .catch(error => {
    //     console.log(error);
    //   });

    // **********************************

    // INITIALIZING -> GET TOKEN FROM THE SERVER
    let init = Init('admin@hulupay.com', 'hulu-pay.pass');
    init.then((res) => {
      console.log("GET TOKEN VALUE " + res);
      // setUser(res);
      // setToken(res.access_token);
      // setData(res.access_token);

      this.setState({token:res.access_token})
      let getServiceProviders = GetServiceProviders(res.access_token);
      // GET SERVICE PROVIDERS
      getServiceProviders.then((provider) => {
        console.log("PROVIDERS " + provider[0].name)
        // console.log(" TOken is " + token)
        // setProviders(provider);
        this.setState({providers:provider})

      }).catch((e) => {
        console.log("ERROR ERROR ERROR " + e)
      })


      // let app_code = "GXUFWEMLG";
      // let transactions: any = GetTransactions(app_code, res.access_token);
      // GET TRANSACTIONS
      // transactions.then((transaction: any) => {
      //   console.log("TRANSACTIONS " + transaction[0].application_code)
      //   setTransaction(transaction);

      // }).catch((e: any) => {
      //   console.log("ERROR ERROR ERROR " + e)
      // })

      // let apps: any = GetApps(res.access_token);
      // GET APPS
      // apps.then((app: any) => {
      //   console.log("APPS " + app[0].application_code)
      //   setTransaction(transaction);

      // }).catch((e: any) => {
      //   console.log("ERROR ERROR ERROR " + e)
      // })

      // CREATE APPS
      // let ca = CreateApp("E-Order", "JMEDLZYXMZ", "Online Ordering Application", res.access_token)
      // ca.then((c: any) => {
      //   // console.log("TRANSACTIONS " + transaction[0].application_code)
      //   setCreateApp(c);

      // }).catch((e: any) => {
      //   console.log("ERROR ERROR ERROR CREATE APP" + e)
      // })



    }).catch((e) => console.log(e));

    // **********************************

      this.checkPermission();


    if (this.props?.totals?.coupon_code) {
      this.setState({
        couponCodeInput: this.props?.totals?.coupon_code,
      });
    }

    // const transactionEmitter = new NativeEventEmitter(RNHoverReactSdk)
    // const subscription = transactionEmitter.addListener("transaction_update", (data) => this.onHoverParserMatch(data));

  }

  componentWillUnmount() {
    // this._isMounted = false;
  }
//   async onHoverParserMatch(data) {
//   console.log("received update for transaction with uuid: " + data.uuid);
//   this.setState({ gotSMSResponse: true })
// }
  
  
  onProviderSelect = (value) => {

    this.setState({ selectedProvider: value });
    console.log(value + " you have selected the value id ")

    // if(selectedProvider == 1){

    //   this.setState({temp : makeRequest('100998775', 29.54, 'gift')});

    // }

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

  // #################

  renderPaymentMethods = () => {
    const { providers } = this.state;
    if (this.props.selectedPayment.code === "banktransfer") {
      const radioProps = providers ? providers.map(provider => ({
        label: provider.name,
        value: provider.id,
      })) : <Text> Loading ... </Text>

      return (
        <RadioForm
          radio_props={radioProps}
          initial={0}
          animation={false}
          onPress={value => {
            this.onProviderSelect(value);
          }}
        />
      );
    }


  }

  // ####################


  // _________________________________________________________________

  openAlert=()=>{
    alert('Alert with one button');
  }
  
  openTwoButtonAlert=()=>{
    Alert.alert(
      'Hey There!',
      'Two button alert dialog',
      [
        {text: 'Yes', onPress: () => console.log('Yes button clicked')},
        {text: 'No', onPress: () => console.log('No button clicked'), style: 'cancel'},
      ],
      { 
        cancelable: true 
      }
    );
  }
  
  openThreeButtonAlert=()=>{
    Alert.alert(
      'Hey There!', 'Three button alert dialog',
      [
        {text: 'Ask me later', onPress: () => console.log('Later button clicked')},
        {text: 'Yes', onPress: () => console.log('Yes button is clicked')},
        {text: 'OK', onPress: () => console.log('OK button clicked')},
      ],
      { 
        cancelable: false 
      }
    );
  }

  openGrantPermissionAlert=()=> {
    Alert.alert(
      'Permission required',
      'The app wants to access your SIM',
      [
        {text: 'DENY', onPress: () => console.log('DENY button clicked')},
        {text: 'ALLOW', onPress: () => {getPermission(),
        console.log('ALLOW button clicked')}, style: 'cancel'},
      ],
      { 
        cancelable: true 
      }
    );
  }


  // _________________________________________________________________


  theMakeRequest = (app_code, serviceProvider_ID, amount, reason, receiver, token, sender) => {
  // theMakeRequest = (account, fee, reason) => {
  //   let api = makeRequest(account, fee, reason);
    let api = MakeTransaction(app_code, serviceProvider_ID, amount, reason,  receiver, token, sender)
    api
      .then(response => {
        console.log('make request call', response);
        this.setState({
          temp: response
        })

        console.log(" value of temp is " + this.state.temp)
        if (typeof(this.state.temp) == 'undefined' || this.state.temp == false){
          console.log("i am in here - in if")
          return 
        }else {
          console.log("i am in here - in else")

          this.onPlacePressedOption1()
        }
      
      })
      // .then(() => this.onPlacePressedOption1())
      .catch(error => {
        console.log(error);
      });

  }
  
  getPermission = () => {
  let api = getPermission();
    api
      .then(response => {
        console.log('get permission function call', response);
        this.setState({
          permsGranted: true 
        })
      
      })
      .catch(error => {
        console.log(error);
        this.setState({
          permsGranted: false 
        })
      });	
  
  }
checkPermission = () => {
let api = checkPermission();
    api
      .then(response => {
        console.log('check permission function call', response);
        this.setState({
          permsGranted: true 
        })
      
      })
      .catch(error => {
        console.log(error);
        this.setState({
          permsGranted: false 
        })
      });
	}


  render() {
    const theme = this.context;
    		// this.checkPermission();

        // const { permsGranted } = this.state;

    return (
      <View style={styles.container(theme)}>

{/* <View style={styles.mainWrapper}>
        <Button title='1 button alert' onPress={this.openAlert}/>

        <Button title='2 buttons alert' onPress={this.openTwoButtonAlert}/>

        <Button title='3 buttons alert' onPress={this.openThreeButtonAlert}/>
      </View> */}
      
      	{/* <Button 
					onPress={this.getPermission}
					
				>Get Permission </Button> */}
				{/* {this.state.permsGranted ? <Text>Permissions Granted</Text> : <Text>Permissions not granted</Text>} */}
        {console.log(this.props.selectedPayment.code + " this is the selected payment you chose")}
        {

          this.renderPaymentMethods()



        }
       {/* <Text> {this.state.selectedProvider}</Text>
       <Text> {this.state.temp}</Text> */}

      {/* { this.state.selectedProvider != null ? this.theMakeRequest(e) :  "not executed"} */}
        {/* {this.state.selectedProvider == 1 && this.state.permsGranted === false ? this.openGrantPermissionAlert() : <Text></Text>} */}
        {/* {(this.state.selectedProvider == 1  && this.state.permsGranted === true) ? <Text>" getting in to here " </Text>: <Text></Text>} */}
        {/* <Text>{`${this.state.permsGranted == true} value`}</Text> */}
        { console.log("check permisssion function called   " +  this.state.permsGranted)}
        {/* {console.log(this.checkPermission())} */}
        {/* { this.state.selectedProvider == 2 ? this.theMakeRequest('1000023', 24.89, 'gift') : <Text></Text> } */}
        {/* {this.alertDialogBox()} */}
        {this.renderCoupon()}
        {this.renderTotals()}
        {this.renderButton()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  // image: {
  //   flex: 1,
  //   justifyContent: 'flex-start',
  //   alignSelf: 'flex-end'

  // },
  // image: {
  //   flex: 1,
  //   justifyContent: "center"
  // },
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
    flexDirection:'row',
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
