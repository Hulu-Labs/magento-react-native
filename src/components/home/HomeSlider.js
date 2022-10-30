import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet } from 'react-native';
import FastImage from 'react-native-fast-image';
import Swiper from 'react-native-swiper';
import { Text } from '../common';
import { magento } from '../../magento';
import { ThemeContext } from '../../theme';

const HomeSlider = ({ slider, style }) => {
  const theme = useContext(ThemeContext);

  const renderMediaItems = () =>
    slider.map((slide, index) => (
      <View key={index} style={styles.slide}>
        <FastImage
          style={styles.imageStyle(theme)}
          resizeMode="cover"
          source={{ uri: magento.getMediaUrl() + slide.image }}
        />
        <Text style={styles.slideTitle(theme)}>{slide.title}</Text>
        <View style={styles.overlay} />

      </View>
    ));

  return (
    <View style={[styles.imageContainer(theme), style]}>
      {/* autoplay set to true  */}
      <Swiper showsPagination={false} pagingEnabled autoplay={true}>
        {renderMediaItems()}
      </Swiper>
    </View>
  );
};

HomeSlider.propTypes = {
  slider: PropTypes.array,
  style: PropTypes.object,
};

HomeSlider.defaultProps = {
  slider: [],
  style: {},
};

const styles = StyleSheet.create({
  imageContainer: theme => ({
    height: theme.dimens.WINDOW_HEIGHT * 0.2,
  }),
  imageStyle: theme => ({
    height: theme.dimens.WINDOW_HEIGHT * 0.2,
    width: theme.dimens.WINDOW_WIDTH,
    top: 0,
    opacity: 0.6,
    backgroundColor: 'black'
  }),
  slide: {
    alignItems: 'center',
    // backgroundColor: 'black',
    // position:'relative'

  },
  slideTitle: theme => ({
    marginTop: theme.dimens.WINDOW_HEIGHT * 0.1,
    marginLeft: theme.dimens.WINDOW_WIDTH * 0.1,
    marginRight: theme.dimens.WINDOW_WIDTH * 0.1,
    position: 'absolute',
    fontSize: 17,
    color: theme.colors.white,
    textAlign: 'center',
  }),
  overlay: {
    // ...imageStyle(theme),
    backgroundColor: 'black'
  }
});

export default HomeSlider;
