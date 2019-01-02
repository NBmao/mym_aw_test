    import * as PropTypes from 'prop-types';
    import { BaseComponent} from './BaseComponent';
    import * as Validation from './Validation';
    import * as Utils from './Utils';

    export interface IBaseFormElementProps {
        onValidationResultChange?: (isValid: boolean, validationErrors: string[]) => void;
    }

    export abstract class BaseFormElement<TProps extends IBaseFormElementProps, TState> extends BaseComponent<TProps, TState> implements Validation.IValidatable {

        private _lastValidationErrors: string[] = [];

        public context: Validation.IFormElementContextWrapper;

        constructor(props: TProps) {
            super(props);
        }

        public abstract isValid(): boolean;

        protected triggerValidationResultChange(validationErrors: string[]) {
            if (!this.props.onValidationResultChange) {
                return;
            }

            if (!Utils.ObjectComparer.arraysDiffer(this._lastValidationErrors, validationErrors)) {
                return;
            }

            this._lastValidationErrors = validationErrors;
            var isValid = Utils.Arrays.isNullOrEmpty(validationErrors);
            this.props.onValidationResultChange(isValid, validationErrors);
        }

        public static contextTypes: React.ValidationMap<any> = {
            formElement: PropTypes.object.isRequired
        };
                
        public componentWillMount() {
            super.componentWillMount();

            if (this.context && this.context.formElement && this.context.formElement.attachToForm) {
                this.context.formElement.attachToForm(this);
            }
        }

        public componentWillUnmount() {
            super.componentWillUnmount();

            if (this.context && this.context.formElement && this.context.formElement.detachFromForm) {
                this.context.formElement.detachFromForm(this);
            }
        }
    }