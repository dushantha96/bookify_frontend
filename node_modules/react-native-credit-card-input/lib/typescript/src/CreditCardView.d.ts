import { type ImageSourcePropType, type ViewStyle } from 'react-native';
import type { CreditCardIssuer } from './useCreditCardForm';
interface Props {
    focusedField?: 'name' | 'number' | 'expiry' | 'cvc';
    type?: CreditCardIssuer;
    name?: string;
    number?: string;
    expiry?: string;
    cvc?: string;
    placeholders?: {
        number: string;
        expiry: string;
        cvc: string;
        name: string;
    };
    style?: ViewStyle;
    fontFamily?: string;
    imageFront?: ImageSourcePropType;
    imageBack?: ImageSourcePropType;
}
declare const CreditCardView: (props: Props) => import("react/jsx-runtime").JSX.Element;
export default CreditCardView;
//# sourceMappingURL=CreditCardView.d.ts.map