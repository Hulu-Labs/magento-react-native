import React from 'react';
import { FlatList, SafeAreaView, Text, StyleSheet, Image } from 'react-native';
import PropTypes from 'prop-types';
import CategoryTreeListItem from './CategoryTreeListItem';
import logo from '../../../assets/logo.png'

const CategoryTreeList = ({ categories, refreshControl }) => {
  const renderItem = category => {
    return <CategoryTreeListItem category={category.item} expanded={false} selected={null} />;
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>

      <FlatList
        refreshControl={refreshControl}
        data={categories}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
      // style={styles.children}
      />
      {console.log(categories, "from catagory tree list item")}
    </SafeAreaView>
  );
};

CategoryTreeList.propTypes = {
  categories: PropTypes.arrayOf(PropTypes.object),
  refreshControl: PropTypes.element,
};

CategoryTreeList.defaultProps = {
  refreshControl: <></>,
};

const styles = StyleSheet.create({
  logo: {
    justifyContent: 'center',
    alignSelf: 'center',
    width: 150,
    height: 60,
    marginBottom: 40,
    //  bottom:50
    //  top: 10

  },
  //  children: {
  //   // justifyContent: 'space-between',
  //   // ...Typography.bodyText,
  //   fontSize: 10,
  //   color:"yellow"
  // },
})

export default CategoryTreeList;
