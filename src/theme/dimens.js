import { Dimensions } from 'react-native';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

export default {
  /**
   * App level constants
   */
  WINDOW_WIDTH: screenWidth,
  WINDOW_HEIGHT: screenHeight,
  headerButtonSize: 23,
  borderRadius: 2,
  defaultButtonWidth: screenWidth * 0.7,
  defaultButtonHeight: 40,
  defaultInputBoxHeight: 40,
  productListItemInBetweenSpace: 1,
  productListItemImageHeight: 200,
  /**
   * HomeScreen and it's component related constants
   */
  homeProductImageWidth: 80,
  homeProductImageHeight: 80,
  // modified width and height for home page - START
  homeProductImageWidth2: 200,
  homeProductImageHeight2: 200,
  // END
  /**
   * SeacrhScreen and it's component related constants
   */
  searchBarHeight: 55,
  searchBarBorderRadius: 25,
  /**
   * OrderScreen and it's component related constants
   */
  orderImageWidth: 100,
  orderImageHeight: 100,
  /**
   * CartScreen and it's component related constants
   */
  cartItemImageHeight: 100,
  cartItemImageHeight2: 300,

  /**
   * Product screen and it's component related constants
   */
  productDetailImageHeight: 300,
  productDetailImageWidth: 300,

  /**
   * Checkout Screen and it's component related constants
   */
  checkouSectionHeaderHeight: 50,
};
