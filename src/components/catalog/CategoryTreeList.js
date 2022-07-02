import React from 'react';
import { FlatList, SafeAreaView } from 'react-native';
import PropTypes from 'prop-types';
import CategoryTreeListItem from './CategoryTreeListItem';

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

export default CategoryTreeList;
