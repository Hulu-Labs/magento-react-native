import React, { useContext, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { View, TouchableOpacity, LayoutAnimation, Image } from 'react-native';
import { Icon } from 'react-native-elements';
import CategoryTreeList from './CategoryTreeList';
import { Text } from '../common';
import { setCurrentCategory, resetFilters } from '../../actions/index';
import { NAVIGATION_CATEGORY_PATH } from '../../navigation/routes';
import NavigationService from '../../navigation/NavigationService';
import { ThemeContext } from '../../theme';
import { magentoOptions } from '../../config/magento';



const CategoryTreeListItem = props => {
  const [expanded, setExpanded] = useState(false);
  const dispatch = useDispatch();
  const theme = useContext(ThemeContext);

  useEffect(() => {
    const switchAnimation = {
      duration: 150,
      update: {
        type: LayoutAnimation.Types.linear,
        property: LayoutAnimation.Properties.opacity,
      },
    };
    LayoutAnimation.configureNext(switchAnimation);
  });

  const onExpandPress = () => setExpanded(!expanded);

  const onRowPress = () => {
    const { category } = props;
    dispatch(resetFilters());
    dispatch(setCurrentCategory({ category }));
    NavigationService.navigate(NAVIGATION_CATEGORY_PATH, {
      title: category.name,
    });

  };


  const renderExpandButton = () => {
    if (props.category?.children_data?.length) {
      // ios-arrow-dropdown
      const icon = expanded ? 'ios-arrow-dropdown' : 'ios-arrow-dropright';
      return (
        <TouchableOpacity onPress={onExpandPress} style={styles.expandIcon(theme)}>
          <Icon
            iconStyle={styles.dropIcon(theme)}
            size={20}
            name={icon}
            type="ionicon"
            color="#999"
          />
        </TouchableOpacity>
      );
    }
  };



  const renderItem = () => {
    const { category } = props;
    const titleStyle = {
      alignSelf: 'flex-start',
      paddingLeft: 10 * category.level,
    };

    const rawUri = category.image ? magentoOptions.url.concat(category.image) : null;
    const uri = `${rawUri ?? ''}?width=100`;
    return (
      <View >

        <TouchableOpacity onPress={onRowPress} style={styles.rowStyles(theme)}>
          {uri ? <Image source={{ uri }} style={styles.logo} /> : <Text></Text>}
          <Text type="heading" style={titleStyle}>
            {category.name}
          </Text>
          {renderExpandButton()}
        </TouchableOpacity>
      </View>
    );
  };


  const renderChildren = () => {

    if (expanded) {
      return (
        <View style={styles.children}>
          <CategoryTreeList categories={props.category?.children_data} />
        </View>
      );
    }
  };

  return (
    <View >

      {renderItem()}
      {renderChildren()}
    </View>
  );
};

const styles = {
  children: {
    justifyContent: 'space-between',
    // ...Typography.bodyText,
    fontSize: 10,
    color: "yellow"
  },
  rowContainer: {
    flexDirection: 'row'
  },
  rowStyles: theme => ({
    flex: 1,
    flexDirection: 'row',
    // justifyContent: 'space-between',
    // width:200,
    // borderBottomWidth: 1,
    // borderColor: theme.colors.border,
    paddingVertical: theme.spacing.small,
    // background color of each iterating category list item
    backgroundColor: theme.colors.lightGrey,
    // backgroundColor: theme.colors.surface,
    // marginLeft:35
  }),
  dropIcon: theme => ({
    height: 24,
    padding: 2,
    paddingRight: theme.spacing.large,
    justifyContent: 'flex-end',
    marginLeft: 40

  }),
  expandIcon: theme => ({
    height: 24,
    padding: 2,
    paddingRight: theme.spacing.large,
    justifyContent: 'space-between',
    flex: 1,
    flexDirection: 'row'

  }),
  buttonPress: {
    borderColor: "#66",
    backgroundColor: "red",
    borderWidth: 1,
    borderRadius: 10
  },
  logo: {
    // justifyContent: 'center',
    // alignSelf: 'center',  
    width: 30,
    height: 34,
    //  flexDirection: 'row',
    marginLeft: 10,

  },

};

export default CategoryTreeListItem;
