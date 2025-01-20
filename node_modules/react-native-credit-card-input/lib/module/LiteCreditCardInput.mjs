import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Image, LayoutAnimation, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import Icons from "./Icons.mjs";
import { useCreditCardForm } from "./useCreditCardForm.mjs";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
const s = StyleSheet.create({
  container: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden'
  },
  icon: {
    width: 48,
    height: 40,
    resizeMode: 'contain'
  },
  expanded: {
    flex: 1
  },
  hidden: {
    width: 0
  },
  leftPart: {
    overflow: 'hidden'
  },
  rightPart: {
    overflow: 'hidden',
    flexDirection: 'row'
  },
  last4: {
    flex: 1,
    justifyContent: 'center'
  },
  numberInput: {
    width: 1000
  },
  expiryInput: {
    width: 80
  },
  cvcInput: {
    width: 80
  },
  last4Input: {
    width: 60,
    marginLeft: 20
  },
  input: {
    height: 40,
    fontSize: 16,
    // @ts-expect-error outlineWidth is used to hide the text-input outline on react-native-web
    outlineWidth: 0
  }
});
const LiteCreditCardInput = props => {
  const {
    autoFocus = false,
    style,
    inputStyle,
    placeholderColor = 'darkgray',
    placeholders = {
      number: '1234 5678 1234 5678',
      expiry: 'MM/YY',
      cvc: 'CVC'
    },
    onChange = () => {},
    onFocusField = () => {},
    testID
  } = props;
  const _onChange = formData => {
    // Focus next field when number/expiry field become valid
    if (status.number !== 'valid' && formData.status.number === 'valid') {
      toggleFormState();
      expiryInput.current?.focus();
    }
    if (status.expiry !== 'valid' && formData.status.expiry === 'valid') {
      cvcInput.current?.focus();
    }
    onChange(formData);
  };
  const {
    values,
    status,
    onChangeValue
  } = useCreditCardForm(_onChange);
  const [showRightPart, setShowRightPart] = useState(false);
  const toggleFormState = useCallback(() => {
    LayoutAnimation.easeInEaseOut();
    setShowRightPart(v => !v);
  }, []);
  const numberInput = useRef(null);
  const expiryInput = useRef(null);
  const cvcInput = useRef(null);
  useEffect(() => {
    if (autoFocus) numberInput.current?.focus();
  }, [autoFocus]);
  const cardIcon = useMemo(() => {
    if (values.type && Icons[values.type]) return Icons[values.type];
    return Icons.placeholder;
  }, [values.type]);
  return /*#__PURE__*/_jsxs(View, {
    style: [s.container, style],
    testID: testID,
    children: [/*#__PURE__*/_jsx(View, {
      style: [s.leftPart, showRightPart ? s.hidden : s.expanded],
      children: /*#__PURE__*/_jsx(View, {
        style: [s.numberInput],
        children: /*#__PURE__*/_jsx(TextInput, {
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
        })
      })
    }), /*#__PURE__*/_jsx(TouchableOpacity, {
      activeOpacity: 0.8,
      onPress: toggleFormState,
      children: /*#__PURE__*/_jsx(Image, {
        style: s.icon,
        source: {
          uri: cardIcon
        }
      })
    }), /*#__PURE__*/_jsxs(View, {
      style: [s.rightPart, showRightPart ? s.expanded : s.hidden],
      children: [/*#__PURE__*/_jsx(TouchableOpacity, {
        activeOpacity: 0.8,
        onPress: toggleFormState,
        style: s.last4,
        children: /*#__PURE__*/_jsx(View, {
          pointerEvents: 'none',
          children: /*#__PURE__*/_jsx(TextInput, {
            keyboardType: "numeric",
            value: status.number === 'valid' ? values.number.slice(values.number.length - 4) : '',
            style: [s.input, s.last4Input],
            readOnly: true
          })
        })
      }), /*#__PURE__*/_jsx(View, {
        style: s.expiryInput,
        children: /*#__PURE__*/_jsx(TextInput, {
          ref: expiryInput,
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
        })
      }), /*#__PURE__*/_jsx(View, {
        style: s.cvcInput,
        children: /*#__PURE__*/_jsx(TextInput, {
          ref: cvcInput,
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
        })
      })]
    })]
  });
};
export default LiteCreditCardInput;
//# sourceMappingURL=LiteCreditCardInput.mjs.map