    import * as React from 'react';
    import * as ReactDOM from 'react-dom';
    import * as PropTypes from 'prop-types';

    import {BaseComponent} from './BaseComponent';
    import * as Validation from "./Validation";

    export abstract class FormComponent<TProps, TState> extends BaseComponent<TProps, TState> implements Validation.IValidatable {
        constructor(props: TProps) {
            super(props);
        }

        private _inputs: Array<Validation.IValidatable> = [];

        public static childContextTypes: React.ValidationMap<any> = {
            formElement: PropTypes.object.isRequired
        };

        public abstract render();

        public getChildContext() {
            return {
                formElement: {
                    attachToForm: (input: Validation.IValidatable) => this.attachToForm(input),
                    detachFromForm: (input: Validation.IValidatable) => this.detachFromForm(input)
                }
            }
        }

        public isValid(): boolean {
            var valid = true;
            var firstError: Element | Text = null;
            this._inputs.forEach((input) => {
                if (!input.isValid()) {
                    valid = false;
                    if (firstError == null) {
                        firstError = ReactDOM.findDOMNode(input as any);
                    }
                }
            });

            /*if (firstError) {
                Utils.Scroll.focusElement(firstError);
            }*/

            return valid;
        }

        private attachToForm(input: Validation.IValidatable) {
            if (this._inputs.indexOf(input) !== -1) {
                return;
            }

            this._inputs.push(input);
        }

        private detachFromForm(input: Validation.IValidatable) {
            var inputPos = this._inputs.indexOf(input);
            if (inputPos === -1) {
                return;
            }

            this._inputs = [...this._inputs.slice(0, inputPos), ...this._inputs.slice(inputPos + 1)];
        }
    }

