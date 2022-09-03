import React, { useContext, useEffect } from 'react';
import { RefreshControl, View, Image, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import { Spinner } from '../common/index';
import { initMagento, getCategoryTree } from '../../actions/index';
import CategoryTreeList from './CategoryTreeList';
import { ThemeContext } from '../../theme';
import logo from '../../../assets/logo.png'


const CategoryTree = ({
  categoryTree,
  refreshing,
  getCategoryTree: _getCategoryTree,
}) => {
  const theme = useContext(ThemeContext);

  useEffect(() => {
    _getCategoryTree();
  }, [_getCategoryTree]);

  const onRefresh = () => {
    _getCategoryTree(true);
  };

  const renderContent = () => {
    if (categoryTree) {
      return (
        <CategoryTreeList
          categories={categoryTree.children_data}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      );
    }
    return <Spinner />;
  };

  return <View style={styles.container(theme)}><Image source={logo} style={styles.logo} />
    <View
      style={{
        borderBottomColor: 'white',
        borderBottomWidth: StyleSheet.hairlineWidth,
        marginBottom: 20

      }}
    />
    {renderContent()}</View>;
};

CategoryTree.navigationOptions = {
  title: 'Categories'.toUpperCase(),
  headerBackTitle: ' ',
  headerStyle: {
    backgroundColor: 'red',
  },
  headerTintColor: '#fff',
  headerTitleStyle: {
    color: 'white',
  },
};

const styles = {
  container: theme => ({
    flex: 1,
    // background of the drawer container
    backgroundColor: theme.colors.lightGrey,
    // backgroundColor: theme.colors.test,
    paddingTop: 60
    // color:theme.colors.test
  }),
  logo: {
    justifyContent: 'center',
    alignSelf: 'center',

    width: 150,
    height: 60,
    marginBottom: 70,
    //  bottom:50
    //  top: 10

  },
};

const mapStateToProps = ({ categoryTree }) => ({
  categoryTree,
  refreshing: categoryTree.refreshing,
});

export default connect(mapStateToProps, { initMagento, getCategoryTree })(
  CategoryTree,
);
