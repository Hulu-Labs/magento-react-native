import React, { useContext } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';
import { Text, Price } from '../common';
import { NAVIGATION_ORDER_PATH } from '../../navigation/routes';
import NavigationService from '../../navigation/NavigationService';
import { ThemeContext } from '../../theme';
import { translate } from '../../i18n';
import { priceSignByCode } from '../../helper/price';

const OrderListItem = ({ item }) => {
  const theme = useContext(ThemeContext);
  const currencySymbol = priceSignByCode(item.order_currency_code);
  console.log(currencySymbol);
  const openOrdersScreen = () => {
    NavigationService.navigate(NAVIGATION_ORDER_PATH, {
      item,
    });
  };

  return (
    <View>
      <Text type="label">
        {`
        ${item.created_at
          }`}</Text>
      <TouchableOpacity onPress={openOrdersScreen}>
        <View style={styles.container(theme)}>
          <Text bold>{`${translate('common.order')} # ${item.increment_id
            }`}</Text>
          {/*
          Orginal - created at - moved above the box

          <Text type="label">{`${translate('orderListItem.created')}: ${
            item.created_at
          }`}</Text> 
          
        */}
          <Text type="label">
            {`${translate('orderListItem.shipTo')} ${item.customer_firstname} ${item.customer_lastname
              }`}
          </Text>
          <View style={styles.row}>
            <Text type="label">
              {`${translate('orderListItem.orderTotal')}: `}
            </Text>
            <Price
              basePrice={item.grand_total}
              currencySymbol={currencySymbol}
              currencyRate={1}
            />
          </View>
          <Text type="label">{`${translate('orderListItem.status')}: ${item.status
            }`}</Text>
        </View>
      </TouchableOpacity>
    </View>

  );
};

const styles = StyleSheet.create({
  container: theme => ({
    backgroundColor: theme.colors.surface,
    borderRadius: theme.dimens.borderRadius,
    marginTop: theme.spacing.small,
    padding: theme.spacing.small,
    borderBottomWidth: 1,
    borderColor: theme.colors.border,
    flex: 1,
    margin: 10,
    borderRadius: 20,
    padding: 20
  }),
  row: {
    flexDirection: 'row',
  },
});

OrderListItem.propTypes = {
  item: PropTypes.object.isRequired,
  // currencySymbol: PropTypes.string.isRequired => removed isRequired 
  // The prop `currencySymbol` is marked as required in `Price`, no need to make it required here
  currencySymbol: PropTypes.string,
};

OrderListItem.defaultProps = {};

export default OrderListItem;
