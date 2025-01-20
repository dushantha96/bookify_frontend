"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useCreditCardForm = void 0;
var _react = require("react");
var _cardValidator = _interopRequireDefault(require("card-validator"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
// --- Utilities

const toStatus = validation => {
  return validation.isValid ? 'valid' : validation.isPotentiallyValid ? 'incomplete' : 'invalid';
};
const removeNonNumber = (string = '') => string.replace(/[^\d]/g, '');
const limitLength = (string = '', maxLength) => string.slice(0, maxLength);
const addGaps = (string = '', gaps) => {
  const offsets = [0].concat(gaps).concat([string.length]);
  return offsets.map((end, index) => {
    if (index === 0) return '';
    const start = offsets[index - 1] || 0;
    return string.slice(start, end);
  }).filter(part => part !== '').join(' ');
};
const formatCardNumber = (number, maxLength, gaps) => {
  const numberSanitized = removeNonNumber(number);
  const lengthSanitized = limitLength(numberSanitized, maxLength);
  const formatted = addGaps(lengthSanitized, gaps);
  return formatted;
};
const formatCardExpiry = expiry => {
  const sanitized = limitLength(removeNonNumber(expiry), 4);
  if (sanitized.match(/^[2-9]$/)) {
    return `0${sanitized}`;
  }
  if (sanitized.length > 2) {
    return `${sanitized.substr(0, 2)}/${sanitized.substr(2, sanitized.length)}`;
  }
  return sanitized;
};
const formatCardCVC = (cvc, cvcMaxLength) => {
  return limitLength(removeNonNumber(cvc), cvcMaxLength);
};
const useCreditCardForm = onChange => {
  const [formState, setFormState] = (0, _react.useState)({
    number: 'incomplete',
    expiry: 'incomplete',
    cvc: 'incomplete'
  });
  const [values, setValues] = (0, _react.useState)({
    number: '',
    expiry: '',
    cvc: '',
    type: undefined
  });
  const onChangeValue = (0, _react.useCallback)((field, value) => {
    const newValues = {
      ...values,
      [field]: value
    };
    const numberValidation = _cardValidator.default.number(newValues.number);

    // When card issuer cant be detected, use these default (3 digit CVC, 16 digit card number with spaces every 4 digit)
    const cvcMaxLength = numberValidation.card?.code.size || 3;
    const cardNumberGaps = numberValidation.card?.gaps || [4, 8, 12];
    const cardNumberMaxLength =
    // Credit card number can vary. Use the longest possible as maximum (otherwise fallback to 16)
    Math.max(...(numberValidation.card?.lengths || [16]));
    const newFormattedValues = {
      number: formatCardNumber(newValues.number, cardNumberMaxLength, cardNumberGaps),
      expiry: formatCardExpiry(newValues.expiry),
      cvc: formatCardCVC(newValues.cvc, cvcMaxLength),
      type: numberValidation.card?.type
    };
    const newFormState = {
      number: toStatus(_cardValidator.default.number(newFormattedValues.number)),
      expiry: toStatus(_cardValidator.default.expirationDate(newFormattedValues.expiry)),
      cvc: toStatus(_cardValidator.default.cvv(newFormattedValues.cvc, cvcMaxLength))
    };
    setValues(newFormattedValues);
    setFormState(newFormState);
    onChange({
      valid: newFormState.number === 'valid' && newFormState.expiry === 'valid' && newFormState.cvc === 'valid',
      values: newFormattedValues,
      status: newFormState
    });
  }, [values, onChange]);
  return {
    values,
    status: formState,
    onChangeValue
  };
};
exports.useCreditCardForm = useCreditCardForm;
//# sourceMappingURL=useCreditCardForm.cjs.map