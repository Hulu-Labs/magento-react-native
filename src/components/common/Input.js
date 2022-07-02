import React, { useContext } from 'react';
import { TextInput, View, ViewPropTypes } from 'react-native';
import PropTypes from 'prop-types';
import { Text } from './Text';
import { ThemeContext } from '../../theme';
import Icon from 'react-native-vector-icons/FontAwesome';


const Input = ({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry,
  assignRef,
  containerStyle,
  labelStyle,
  inputStyle,
  name,
  ...props
}) => {
  const theme = useContext(ThemeContext);

  return (
    <View style={[styles.containerStyle(theme), containerStyle]}>
    <Icon style={styles.inputIcon} name={name ? name : ""} size={25} color="#2CB4FB" /> 

      {label && (
        <Text type="heading" style={[styles.labelStyle(theme), labelStyle]}>
          {label}
        </Text>
      )}
      <TextInput
        {...props}
        secureTextEntry={secureTextEntry}
        placeholder={placeholder}
        placeholderTextColor={theme.colors.bodyText}
        autoCorrect={false}
        style={[styles.inputStyle(theme), inputStyle]}
        value={value}
        onChangeText={onChangeText}
        ref={component => {
          assignRef && assignRef(component);
        }}
      />
    </View>
  );
};

const styles = {
  containerStyle: theme => ({
    height: theme.dimens.defaultInputBoxHeight,
    backgroundColor: theme.colors.surface,
    // borderWidth: 1,
    // borderColor: theme.colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 15,
    // paddingBottom: 10
    // flex:1
  }),
  inputStyle: theme => ({
    color: theme.colors.titleText,
    // padding: theme.spacing.small,
    flex: 2,
    // padding:10
  }),
  labelStyle: theme => ({
    paddingLeft: theme.spacing.large,
    flex: 1,
  }),
  inputIcon: {
    padding: 10,
    height:50
},
};

Input.propTypes = {
  label: PropTypes.string,
  value: PropTypes.string,
  onChangeText: PropTypes.func,
  placeholder: PropTypes.string,
  secureTextEntry: PropTypes.bool,
  containerStyle: ViewPropTypes.style,
  assignRef: PropTypes.func,
};

Input.defaultProps = {
  label: null,
  value: '',
  placeholder: '',
  secureTextEntry: false,
  assignRef: () => {},
  onChangeText: () => {},
};

export { Input };
