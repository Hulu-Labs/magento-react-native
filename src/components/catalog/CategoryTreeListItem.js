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
import  logo from '../../../assets/women-icon/dress.png'
const CategoryTreeListItem = props => {
  const [expanded, setExpanded] = useState(false);
  const dispatch = useDispatch();
  const theme = useContext(ThemeContext);
  // this.state = { pressStatus: false };
  const [selected, setSelected] = useState(null)
  const [active, setActive] = useState(false);
  // const iconCollection = [{name: "women", src: "../../../assets/women-icon/dress.png"}]
  const iconCollection = [{women: "../../../assets/women-icon/dress.png"}]
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
    setSelected(category.id)
    // setActive(!active)

  };
  // const buttonTextStyle = {
  //   color: active ? 'red' : 'yellow',
  //   fontStyle: active ? 'unset' : 'italic',
  //   fontWeight: active ? 'bold' : 'normal',
  //   backgroundColor: active ? '#00cc00' : '#f2f2f2'
  // };

  const renderExpandButton = () => {
    if (props.category?.children_data?.length) {
      const icon = expanded ? 'ios-arrow-dropdown' : 'ios-arrow-dropright';
      return (
        <TouchableOpacity onPress={onExpandPress}>
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

  const isKeyInArray = ( key) => { 
    return iconCollection.some(obj => obj.hasOwnProperty(key)); 
  }

  const getValueFromKeyInArray = (key) => { 
    console.log(iconCollection, "icon collection")
    return iconCollection.find(obj => obj[key])?.[key]; 
    // return iconCollection.find(obj => obj.name == obj[key])?.[key];
  }
  

  const renderItem = () => {
    const { category } = props;
    const titleStyle = {
      alignSelf: 'flex-start',
      paddingLeft: 10 * category.level,
    };
    // if(selected){
    //   setSelected(null);
    // }
    // var exists = iconCollection.filter(function (o) {
    //   return o.hasOwnProperty(val.lowercase());
    // }).length > 0;
    let path = getValueFromKeyInArray(category.name.toLowerCase()) 
    console.log("                                      here is the path           ", path)

    console.log(iconCollection[0].women, "            checking the path")
    let key = category.name.toLowerCase();
    return (
      <View>
        {/* style={styles.rowStyles(theme)}  */}
        {/* {console.log(pressStatus)} */}
        <TouchableOpacity onPress={onRowPress}  
        // key={category.id}
        // style={[styles.button, { backgroundColor: category.id === selected ? '#00cc00' : '#f2f2f2' }]}
        // style= { (category.id === selected ) ? {backgroundColor: "#00cc00"}  : styles.rowStyles(theme)}
        style={styles.rowStyles(theme)} 
        // style={styles.rowStyles(theme)}  
//         style={
// pressStatus
// ? styles.buttonPress
// : styles.rowStyles(theme)
// }
// onHideUnderlay={()=>_onHideUnderlay()}
// onShowUnderlay={()=>_onShowUnderlay()}
>
{/* {console.log(category.id, "this is to check")} */}
{/* style={titleStyle} */}
{console.log(path, "                          why is it not called on image                  ")}
   {/* <Text>{ (isKeyInArray(category.name.toLowerCase()) && typeof path != 'undefined' && typeof path === 'string') ? <Image source={path} style={styles.logo} /> : ""}</Text> */}

          <Text type="heading"  style={titleStyle}>
          {/* <Icon style={styles.inputIcon} name={category.name} size={25} color="#2CB4FB" />  */}
            {console.log(iconCollection, "              jjjjjjjjj                     ", category.name.toLowerCase())}
            {console.log(typeof getValueFromKeyInArray(category.name.toLowerCase()), "                           iiiiiiiiiiiiiiiiii            ")}
            {/* { (isKeyInArray(category.name.toLowerCase()) && typeof path != 'undefined' && typeof path === 'string') ? <Image source={path} style={styles.logo} /> : ""} */}
            {/* {iconCollection.map((item, key) => {
                let src = iconCollection.find(obj => obj[key])?.[key]
                console.log(src)
                // let src = iconCollection.find(icon => +food.id === item).src;
                return <Image key={key} style={{flexDirection: "row" }} source={src} />;
              })}
              {
               (isKeyInArray(category.name.toLowerCase()) && typeof path != 'undefined' && typeof path === 'string') ? 
               <Image key={category.name.toLowerCase()} style={{flexDirection: "row" }} source={path} /> : ""
              }  */}
              {console.log(path, "                       getting the value   ")}
              {/* {
      (isKeyInArray(category.name.toLowerCase()) && typeof path != 'undefined') ? <Image style={{flexDirection: "row" }} source={iconCollection[category.name.toLowerCase()]} /> : "noooo"
   } */}

            {category.name}
          </Text>
          {renderExpandButton()}
        </TouchableOpacity>
      </View>
    );
  };

  const renderChildren = () => {
    const { category } = props;
    console.log(category, "this is in renderchilderen ")
  
    if (expanded) {
      return (
        <View>
          {console.log(props.category?.children_data, "purpose of renderchildren")}
          <CategoryTreeList categories={props.category?.children_data} />
        </View>
      );
    }
  };
    const { category } = props;
// if(selected){
//   setSelected(null)
// }
  return (
    <View>
      {console.log(category.id, "returning ")}
      {renderItem()}
      {renderChildren()}
    </View>
  );
};

const styles = {
  rowStyles: theme => ({
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    // borderBottomWidth: 1,
    // borderColor: theme.colors.border,
    paddingVertical: theme.spacing.small,
    backgroundColor: theme.colors.surface,
  }),
  dropIcon: theme => ({
    height: 24,
    padding: 2,
    paddingRight: theme.spacing.large,
  }),
  buttonPress: {
    borderColor: "#66",
    backgroundColor: "red",
    borderWidth: 1,
    borderRadius: 10
    },
    logo: {
      justifyContent: 'center',
      alignSelf: 'center',
  
     width:100,
     height:60,
    //  marginBottom:40,
    //  bottom:50
    //  top: 10
     
     },
};

export default CategoryTreeListItem;
