    import * as Validation from './Validation';
    import * as Utils from './Utils';
    import {BaseEditor,IBaseEditorProps} from './BaseEditor';
    import * as React from 'react';

    export interface IBaseTextBoxEditorProps extends IBaseEditorProps{

    } 

    export abstract class BaseTextBoxEditor<TProps extends IBaseTextBoxEditorProps> extends BaseEditor<TProps> {
        
        constructor(props: TProps) {
            super(props);
        }

        protected abstract getInput();

        public render(): JSX.Element {
            var wrapperCss = Object.assign('form-group', this.props.cssWrapper, { 'error': !this.state.isValid });

            return (
                <div
                    className={ wrapperCss } 
                    ref={ (elem: HTMLElement) => this.wrapperRef = elem } >

                    { this.getLabel() }
                    
                    <div className='controls-input'>
                        { this.getInput() }

                        { this.getValidationErrorsContainer() }
                    </div>
                    
                    
                </div>
            );
        }

        public componentDidMount() {
            this.bindLabelToInput();
        }

        private getLabel(): JSX.Element {
            if (!this.props.label) {
                return null;
            }

            return (
                <div className='control-label'>
                    <label htmlFor={ this.state.inputGroupId }>
                        {this.props.label} 
                    </label>
                    { this.getTooltip() }
                </div>
            );
        }

        private bindLabelToInput() {
            var id: string;
            var propId: string = null;
            if (this.props.hasOwnProperty('id'))
            {
                propId = this.props['id'];
            }

            id = (Validation.isNotEmpty(propId)) ? propId : Utils.Guid.getNext();
            this.setState({ inputGroupId: id });
        }
    }
