import { Image, ImageBackground, Platform, StyleSheet, Text, View } from 'react-native';
import FlipCard from 'react-native-flip-card';
import Icons from "./Icons.mjs";
import { useMemo } from 'react';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
const CARD_SIZE = {
  width: 300,
  height: 190
};
const s = StyleSheet.create({
  cardContainer: {},
  cardFace: {
    backgroundColor: '#444',
    borderRadius: 10
  },
  cardMagneticStripe: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 30,
    height: 40,
    backgroundColor: '#000'
  },
  icon: {
    position: 'absolute',
    top: 15,
    right: 15,
    width: 60,
    height: 40,
    resizeMode: 'contain'
  },
  baseText: {
    color: 'rgba(255, 255, 255, 0.5)',
    backgroundColor: 'transparent'
  },
  placeholder: {
    color: 'rgba(255, 255, 255, 0.5)'
  },
  focusedField: {
    fontWeight: 'bold',
    color: 'rgba(255, 255, 255, 1)'
  },
  number: {
    fontSize: 21,
    position: 'absolute',
    top: 95,
    left: 28
  },
  name: {
    fontSize: 16,
    position: 'absolute',
    bottom: 20,
    left: 25,
    right: 100
  },
  expiryLabel: {
    fontSize: 9,
    position: 'absolute',
    bottom: 40,
    left: 218
  },
  expiry: {
    fontSize: 16,
    position: 'absolute',
    bottom: 20,
    left: 220
  },
  amexCVC: {
    fontSize: 16,
    position: 'absolute',
    top: 73,
    right: 30
  },
  cvc: {
    fontSize: 16,
    position: 'absolute',
    top: 80,
    right: 30
  }
});
const CreditCardView = props => {
  const {
    focusedField,
    type,
    name,
    number,
    expiry,
    cvc,
    placeholders = {
      number: '•••• •••• •••• ••••',
      name: '',
      expiry: '••/••',
      cvc: '•••'
    },
    imageFront,
    imageBack,
    fontFamily = Platform.select({
      ios: 'Courier',
      android: 'monospace',
      web: 'monospace'
    }),
    style
  } = props;
  const isAmex = type === 'american-express';
  const shouldShowCardBack = !isAmex && focusedField === 'cvc';
  const cardIcon = useMemo(() => {
    if (type && Icons[type]) return Icons[type];
    return null;
  }, [type]);
  return /*#__PURE__*/_jsx(View, {
    style: [s.cardContainer, CARD_SIZE, style],
    children: /*#__PURE__*/_jsxs(FlipCard, {
      flipHorizontal: true,
      flipVertical: false,
      friction: 10,
      perspective: 2000,
      clickable: false,
      flip: shouldShowCardBack,
      children: [/*#__PURE__*/_jsxs(ImageBackground, {
        style: [CARD_SIZE, s.cardFace],
        source: imageFront,
        children: [!!cardIcon && /*#__PURE__*/_jsx(Image, {
          style: [s.icon],
          source: {
            uri: cardIcon
          }
        }), /*#__PURE__*/_jsx(Text, {
          style: [s.baseText, {
            fontFamily
          }, s.number, !number && s.placeholder, focusedField === 'number' && s.focusedField],
          children: !number ? placeholders.number : number
        }), /*#__PURE__*/_jsx(Text, {
          style: [s.baseText, {
            fontFamily
          }, s.name, !name && s.placeholder, focusedField === 'name' && s.focusedField],
          numberOfLines: 1,
          children: !name ? placeholders.name : name.toUpperCase()
        }), /*#__PURE__*/_jsx(Text, {
          style: [s.baseText, {
            fontFamily
          }, s.expiryLabel, s.placeholder, focusedField === 'expiry' && s.focusedField],
          children: "MONTH/YEAR"
        }), /*#__PURE__*/_jsx(Text, {
          style: [s.baseText, {
            fontFamily
          }, s.expiry, !expiry && s.placeholder, focusedField === 'expiry' && s.focusedField],
          children: !expiry ? placeholders.expiry : expiry
        }), isAmex && /*#__PURE__*/_jsx(Text, {
          style: [s.baseText, {
            fontFamily
          }, s.amexCVC, !cvc && s.placeholder, focusedField === 'cvc' && s.focusedField],
          children: !cvc ? placeholders.cvc : cvc
        })]
      }), /*#__PURE__*/_jsxs(ImageBackground, {
        style: [CARD_SIZE, s.cardFace],
        source: imageBack,
        children: [/*#__PURE__*/_jsx(View, {
          style: s.cardMagneticStripe
        }), /*#__PURE__*/_jsx(Text, {
          style: [s.baseText, s.cvc, !cvc && s.placeholder, focusedField === 'cvc' && s.focusedField],
          children: !cvc ? placeholders.cvc : cvc
        })]
      })]
    })
  });
};
export default CreditCardView;
//# sourceMappingURL=CreditCardView.mjs.map