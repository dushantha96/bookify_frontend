import { type TextStyle, type ViewStyle } from 'react-native';
import { type CreditCardFormData, type CreditCardFormField } from './useCreditCardForm';
interface Props {
    autoFocus?: boolean;
    style?: ViewStyle;
    labelStyle?: TextStyle;
    inputStyle?: TextStyle;
    placeholderColor?: string;
    labels?: {
        number: string;
        expiry: string;
        cvc: string;
    };
    placeholders?: {
        number: string;
        expiry: string;
        cvc: string;
    };
    onChange: (formData: CreditCardFormData) => void;
    onFocusField?: (field: CreditCardFormField) => void;
    testID?: string;
}
declare const CreditCardInput: (props: Props) => import("react/jsx-runtime").JSX.Element;
export default CreditCardInput;
//# sourceMappingURL=CreditCardInput.d.ts.map