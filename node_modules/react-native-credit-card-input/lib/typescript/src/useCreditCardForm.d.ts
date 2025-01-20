export type CreditCardIssuer = 'visa' | 'mastercard' | 'american-express' | 'diners-club' | 'discover' | 'jcb';
export type CreditCardFormField = 'number' | 'expiry' | 'cvc';
export type CreditCardFormValues = {
    number: string;
    expiry: string;
    cvc: string;
    type?: CreditCardIssuer;
};
export type ValidationState = 'incomplete' | 'invalid' | 'valid';
export type CreditCardFormState = {
    number: ValidationState;
    expiry: ValidationState;
    cvc: ValidationState;
};
export type CreditCardFormData = {
    valid: boolean;
    values: CreditCardFormValues;
    status: CreditCardFormState;
};
export declare const useCreditCardForm: (onChange: (formData: CreditCardFormData) => void) => {
    values: CreditCardFormValues;
    status: CreditCardFormState;
    onChangeValue: (field: CreditCardFormField, value: string) => void;
};
//# sourceMappingURL=useCreditCardForm.d.ts.map