import { type TextStyle, type ViewStyle } from 'react-native';
import { type CreditCardFormData, type CreditCardFormField } from './useCreditCardForm';
interface Props {
    autoFocus?: boolean;
    style?: ViewStyle;
    inputStyle?: TextStyle;
    placeholderColor?: string;
    placeholders?: {
        number: string;
        expiry: string;
        cvc: string;
    };
    onChange?: (formData: CreditCardFormData) => void;
    onFocusField?: (field: CreditCardFormField) => void;
    testID?: string;
}
declare const LiteCreditCardInput: (props: Props) => import("react/jsx-runtime").JSX.Element;
export default LiteCreditCardInput;
//# sourceMappingURL=LiteCreditCardInput.d.ts.map