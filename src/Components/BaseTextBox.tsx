
    import {BaseFormElement, IBaseFormElementProps} from './BaseFormElement';
    import * as Validation from './Validation';
    import * as Utils from './Utils';
    import * as React from 'react';
    //import * as $ from 'jQuery';

    export interface IBaseTextBoxProps<TType> extends IBaseFormElementProps {
        value?: TType;

        onChange?: (newValue: TType) => void;

        onBlur?: (newValue: TType) => void;

        onFocus?: (e: any) => void;

        onClick?: (e: React.SyntheticEvent) => void;

        onKeyDown?: (e: React.SyntheticEvent) => void;

        disabled?: boolean;

        disableCopyPaste?: boolean;

        required?: string;

        maxLength?: number; 

        maxLengthValidation?: Validation.IValidationCondition<number>;

        minLengthValidation?: Validation.IValidationCondition<number>;

        placeholder?: string;

        id?: string;

        cssInput?: string;

        autocomplete?: boolean;

        tabIndex?: number;
    }

    export interface IBaseTextBoxState {
        value?: string;

        pristineValue?: any;

        isValid?: boolean;

        isPristine?: boolean;
    }

    // TODO: straslivy hack "IBaseTextBoxProps<any>"
    export abstract class BaseTextBox<TType, TProps extends IBaseTextBoxProps<any>> extends BaseFormElement<TProps , IBaseTextBoxState> {
        protected validator: Validation.TypedValueValidator<string, TType>;

        protected inputRef: HTMLInputElement;

        constructor(props: TProps) {
            super(props);
            this.state = this.getDefaultState(props);

            this.validator = new Validation.TypedValueValidator<string, TType>(this.parseValue);
            this.initRawValidation();
            this.initParsedValidation();

            if (!props.onChange && !props.onBlur) {
                console.warn('Input "onBlur" and "onChange" are both not set. Validation will not be triggered', this);
            }
        }

        protected abstract isParsable(input: string): boolean;

        protected abstract parseValue(input: string): TType;

        public render(): JSX.Element {

            var autocompleteAttribute: any = {};
            var maxLengthAttribute: any = {};
            var tabIndexAttribute : any = {};

            if (this.props.autocomplete !== undefined) {
                autocompleteAttribute.autoComplete = this.props.autocomplete ? 'on' : 'off';
            }

            if (this.props.maxLength !== undefined && this.props.maxLength !== null) {
                maxLengthAttribute.maxLength = this.props.maxLength;
            }

            if (this.props.tabIndex !== undefined && this.props.tabIndex !== null) {
                tabIndexAttribute.tabIndex = this.props.tabIndex;
            }

            return (
                <input
                    type='text'
                    className={ (this.props.cssInput || 'form-input') }
                    value={ this.state.value }
                    disabled={ this.props.disabled }
                    id={ this.props.id }
                    placeholder={ this.props.placeholder }
                    onChange={ (event: React.SyntheticEvent) => this.onChange(event) }
                    onBlur={ (event: React.SyntheticEvent) => this.onBlur(event) }
                    onFocus={ (event: React.SyntheticEvent) => this.onFocus(event) }
                    onKeyDown={ (event: React.SyntheticEvent) => this.onKeyDown(event) }
                    onClick={ (event: React.SyntheticEvent) => this.onClick(event) }
                    ref={ (input: HTMLInputElement) => this.inputRef = input}
                    
                    {...maxLengthAttribute}
                    {...autocompleteAttribute}
                    {...tabIndexAttribute}

                />
            );
        }

        protected getDisplayValue(value: TType): string {
            return (value === null || value === undefined) ? '' : value.toString();
        }
        
        protected initRawValidation(): void {
            this.validator.rawValidator.clear();

            this.validator.rawValidator.add(Validation.isNotEmpty, this.props.required);
            this.validator.rawValidator.addFromCondition(this.props.maxLengthValidation, Validation.maxLength);
            this.validator.rawValidator.addFromCondition(this.props.minLengthValidation, Validation.minLength);
        }

        protected initParsedValidation(): void {
            this.validator.parsedValidator.clear();
        }

        public componentWillReceiveProps(nextProps: TProps) {
            // If the value passed has changed, set it. If value is not passed it will
            // internally update, and this will never run
            if (!Utils.ObjectComparer.isSame(this.props.value, nextProps.value) && !Utils.ObjectComparer.isSame(nextProps.value, this.parseValue(this.state.value))) {
                this.setValue(this.getDisplayValue(nextProps.value), true);
            }
        }

        public componentDidUpdate(prevProps: TProps, prevState: IBaseTextBoxState) {
            if (!Utils.ObjectComparer.isSame(this.props.value, prevProps.value) && !Utils.ObjectComparer.isSame(this.props.value, this.parseValue(this.state.value)) && !this.state.isPristine) {
               this.runValidation(this.state.value);
            }
        }

        public shouldComponentUpdate(nextProps: TProps, nextState: IBaseTextBoxState) {
            return !Utils.ObjectComparer.isSame(this.props, nextProps) || !Utils.ObjectComparer.isSame(this.state, nextState);
        }

        public componentDidMount() {
            // if (this.props.disableCopyPaste) {
            //     $(this.inputRef).bind("cut copy paste", (e: Event) => e.preventDefault());
            // }
        }

        private getDefaultState(props: TProps): IBaseTextBoxState {
            return {
                value: this.getDisplayValue(props.value),
                isValid: true,
                isPristine: true,
                pristineValue: props.value
            };
        }

        private setValue(value: string, isPristine: boolean) {
            this.setState({
                value: value,
                isPristine: isPristine
            });
        }

        private onChange(event: React.SyntheticEvent): any {
            var value = this.inputRef.value;
            this.setValue(value, false);
            if (this.props.onChange) {
                var isValid = this.runValidation(value);
                if (isValid || this.isParsable(value)) {
                    var parsedValue = this.parseValue(value);
                    this.props.onChange(parsedValue);
                }
            }
        }

        private onBlur(event: React.SyntheticEvent): any {
            if (this.props.onBlur) {
                var value = this.inputRef.value;
                var isValid = this.runValidation(value);
                if (isValid || this.isParsable(value)) {
                    var parsedValue = this.parseValue(value);
                    this.props.onBlur(parsedValue);
                }
            }
        }

        private onFocus(event: React.SyntheticEvent): any {
            if (this.props.onFocus) {
                this.props.onFocus(event);
            }
        }

        private onKeyDown(event: React.SyntheticEvent): void {
            if (this.props.onKeyDown) {
                this.props.onKeyDown(event);
            }
        }

        private onClick(event: React.SyntheticEvent): void {
            if (this.props.onClick) {
                this.props.onClick(event);
            }
        }

        protected runValidation(rawValue: string): boolean {
            // if ($(this.inputRef).is(':hidden')) {
            //     return true;
            // }
            
            this.initRawValidation();
            this.initParsedValidation();

            var errors = this.validator.getValidationErrors(rawValue);
            this.triggerValidationResultChange(errors);

            var isValid = Utils.Arrays.isNullOrEmpty(errors);
            this.setState({ isValid: isValid });

            return isValid;
        }
        
        public isValid(): boolean {
            var value = this.inputRef.value;

            return this.runValidation(value);
        }
    }
