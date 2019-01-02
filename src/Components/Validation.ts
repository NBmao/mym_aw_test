import * as RegExPatterns from "./RegExPatterns"

export interface IValidatableContext {
    attachToForm: (inputElement: IValidatable) => void;

    detachFromForm: (inputElement: IValidatable) => void;
}

export interface IValidatable {
    isValid(): boolean;
}

export interface IFormElementContextWrapper {
    formElement: IValidatableContext;
}

export interface IValidationCondition<TValue> {
    errorMessage: string;

    value: TValue;
}

export interface IValidationRule<TValue> {
    errorMessage: string;

    validator: (value: TValue) => boolean;
}

export class Validator<TValue> {
    private _validationRules: IValidationRule<TValue>[] = [];

    public addFromCondition<TConditionValue>(condition: IValidationCondition<TConditionValue>, funct: (value: TValue, conditionValue: TConditionValue) => boolean) {
        if (condition && condition.errorMessage) {
            const rule: IValidationRule<TValue> = {
                validator: (value) => funct(value, condition.value),
                errorMessage: condition.errorMessage
            };

            this._validationRules.push(rule);
        }
    }

    public add(rule: (value: TValue) => boolean, errorMessage: string) {
        if (errorMessage) {
            this._validationRules.push({ validator: rule, errorMessage: errorMessage });
        }
    }

    public addRange(rules: IValidationRule<TValue>[]) {
        if (rules) {
            this._validationRules = this._validationRules.concat(rules.filter(rule => rule != null));
        }
    }

    public clear() {
        this._validationRules = [];
    }

    public getValidationErrors(rawValue: TValue): string[] {
        return this._validationRules.slice().filter(rule => !rule.validator(rawValue)).map(rule => rule.errorMessage);
    }
}

export class TypedValueValidator<TRawValue, TParsedValue> {
    private _parseValue: ((rawValue: TRawValue) => TParsedValue);

    public rawValidator: Validator<TRawValue>;

    public parsedValidator: Validator<TParsedValue>;

    constructor(parseValue: (rawValue: TRawValue) => TParsedValue) {
        this._parseValue = parseValue;
        this.rawValidator = new Validator();
        this.parsedValidator = new Validator();
    }

    public getValidationErrors(rawValue: TRawValue): string[] {
        var rawErrors: string[] = this.rawValidator.getValidationErrors(rawValue);
        if (rawErrors && rawErrors.length && rawErrors.length > 0) {
            return rawErrors;
        }

        var parsedValue = this._parseValue(rawValue);
        var parsedErrors = this.parsedValidator.getValidationErrors(parsedValue);

        return parsedErrors;
    }
}

export function isEmpty(value: any): boolean {
    return value == null || value === '';
}

export function isNotEmpty(value: string) : boolean {
    return !!value;
}

// export function isNumber(value: string): boolean {
//     if (isEmpty(value)) {
//         return true;
//     }

//     const parsedValue: number = Globalize.parseFloat(value);
//     var isValid = !isNaN(parsedValue) && parsedValue !== Infinity;
//     return isValid;
// }

export function matchesRegexp(value: string, regexp: RegExp): boolean {
    return isEmpty(value) || regexp.test(value);
}

export function isSameAs(value: string, test: string): boolean {
    return isEmpty(value) || test == null || test === value;
}

export function isEmail(value: string): boolean {
    return matchesRegexp(value, RegExPatterns.Email);
}

// export function isDate(value: string): boolean {
//     if (isEmpty(value)) {
//         return true;
//     }

//     const parsedValue: Date = Globalize.parseDate(value);
//     var isValid = parsedValue != null; // TODO
//     return isValid;
// }

export function isDateEmpty(d: number, m: number, y: number): boolean {
    return d == null && m == null && y == null;
}

export function isDateComplete(d: number, m: number, y: number): boolean {
    return d != null && m != null && y != null;
}

export function areDatePartsValid(d: number, m: number, y: number): boolean {
    var date = new Date(y, m, d);
    return d === date.getDate() && m === date.getMonth() && y === date.getFullYear();
}

export function areDate(d: number, m: number, y: number): boolean {
    return isDateEmpty(d, m, y) || (isDateComplete(d, m, y) && areDatePartsValid(d, m, y));
}

export function minLength(value: string, min: number): boolean {
    return isEmpty(value) || value.length >= min;
}

export function maxLength(value: string, max: number): boolean {
    return isEmpty(value) || value.length <= max;
}

// export function isAddressPopulated(address: Models.Domains.Address.Address): boolean {
//     if (address == null) {
//         return false;
//     }

//     return address.CountryCode !== null &&
//         address.CountryCode !== Wrap.Constants.Enums.Domain.CountryCode.NotSpecified &&
//         isNotEmpty(address.Line1) &&
//         isNotEmpty(address.Postcode) &&
//         isNotEmpty(address.Line4);
// }