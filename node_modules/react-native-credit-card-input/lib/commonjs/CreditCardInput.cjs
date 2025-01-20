"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = require("react");
var _reactNative = require("react-native");
var _useCreditCardForm = require("./useCreditCardForm.cjs");
var _jsxRuntime = require("react/jsx-runtime");
const s = _reactNative.StyleSheet.create({
  container: {
    paddingVertical: 15,
    paddingHorizontal: 15
  },
  icon: {
    width: 48,
    height: 40,
    resizeMode: 'contain'
  },
  numberInput: {},
  extraContainer: {
    flexDirection: 'row',
    marginTop: 15
  },
  expiryInputContainer: {
    flex: 1,
    marginRight: 5
  },
  cvcInputContainer: {
    flex: 1,
    marginLeft: 5
  },
  input: {
    height: 40,
    fontSize: 16,
    borderBottomColor: 'darkgray',
    borderBottomWidth: 1,
    // @ts-expect-error outlineWidth is used to hide the text-input outline on react-native-web
    outlineWidth: 0
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: 600
  }
});
const CreditCardInput = props => {
  const {
    autoFocus,
    style,
    labelStyle,
    inputStyle,
    placeholderColor = 'darkgray',
    labels = {
      number: 'CARD NUMBER',
      expiry: 'EXPIRY',
      cvc: 'CVC/CVV'
    },
    placeholders = {
      number: '1234 5678 1234 5678',
      expiry: 'MM/YY',
      cvc: 'CVC'
    },
    onChange = () => {},
    onFocusField = () => {},
    testID
  } = props;
  const {
    values,
    onChangeValue
  } = (0, _useCreditCardForm.useCreditCardForm)(onChange);
  const numberInput = (0, _react.useRef)(null);
  (0, _react.useEffect)(() => {
    if (autoFocus) numberInput.current?.focus();
  }, [autoFocus]);
  return /*#__PURE__*/(0, _jsxRuntime.jsxs)(_reactNative.View, {
    style: [s.container, style],
    testID: testID,
    children: [/*#__PURE__*/(0, _jsxRuntime.jsxs)(_reactNative.View, {
      style: [s.numberInput],
      children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.Text, {
        style: [s.inputLabel, labelStyle],
        children: labels.number
      }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.TextInput, {
        ref: numberInput,
        keyboardType: "numeric",
        style: [s.input, inputStyle],
        placeholderTextColor: placeholderColor,
        placeholder: placeholders.number,
        value: values.number,
        onChangeText: v => onChangeValue('number', v),
        onFocus: () => onFocusField('number'),
        autoCorrect: false,
        underlineColorAndroid: 'transparent',
        testID: "CC_NUMBER"
      })]
    }), /*#__PURE__*/(0, _jsxRuntime.jsxs)(_reactNative.View, {
      style: [s.extraContainer],
      children: [/*#__PURE__*/(0, _jsxRuntime.jsxs)(_reactNative.View, {
        style: s.expiryInputContainer,
        children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.Text, {
          style: [s.inputLabel, labelStyle],
          children: labels.expiry
        }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.TextInput, {
          keyboardType: "numeric",
          style: [s.input, inputStyle],
          placeholderTextColor: placeholderColor,
          placeholder: placeholders.expiry,
          value: values.expiry,
          onChangeText: v => onChangeValue('expiry', v),
          onFocus: () => onFocusField('expiry'),
          autoCorrect: false,
          underlineColorAndroid: 'transparent',
          testID: "CC_EXPIRY"
        })]
      }), /*#__PURE__*/(0, _jsxRuntime.jsxs)(_reactNative.View, {
        style: s.cvcInputContainer,
        children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.Text, {
          style: [s.inputLabel, labelStyle],
          children: labels.cvc
        }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.TextInput, {
          keyboardType: "numeric",
          style: [s.input, inputStyle],
          placeholderTextColor: placeholderColor,
          placeholder: placeholders.cvc,
          value: values.cvc,
          onChangeText: v => onChangeValue('cvc', v),
          onFocus: () => onFocusField('cvc'),
          autoCorrect: false,
          underlineColorAndroid: 'transparent',
          testID: "CC_CVC"
        })]
      })]
    })]
  });
};
var _default = exports.default = CreditCardInput;
//# sourceMappingURL=CreditCardInput.cjs.map