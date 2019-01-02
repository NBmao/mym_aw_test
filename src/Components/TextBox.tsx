
    import {BaseTextBox, IBaseTextBoxProps} from './BaseTextBox';
    import * as Validation from './Validation'

    export interface ITextBoxSpecificProps extends IBaseTextBoxProps<string> {
        isEmail?: string;
        regex?: Validation.IValidationCondition<RegExp>;
        equals?: Validation.IValidationCondition<string>;
        validationRules?: Array<Validation.IValidationRule<string>>;
    }

    export interface ITextBoxProps extends ITextBoxSpecificProps, React.Props<TextBox> {
        // NOTE: leave empty
    }

    export class TextBox extends BaseTextBox<string, ITextBoxProps> {
        constructor(props: ITextBoxProps) {
            super(props);
        }

        protected isParsable(input: string): boolean {
            return true;
        }

        protected parseValue(input: string): string {
            return input;
        }

        protected initRawValidation(): void {
            super.initRawValidation();

            this.validator.rawValidator.addFromCondition(this.props.regex, Validation.matchesRegexp);
            this.validator.rawValidator.addFromCondition(this.props.equals, Validation.isSameAs);
        }

        protected initParsedValidation(): void {
            super.initParsedValidation();

            this.validator.parsedValidator.add(Validation.isEmail, this.props.isEmail);

            this.validator.parsedValidator.addRange(this.props.validationRules);
        }
    }