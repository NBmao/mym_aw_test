
    import {BaseTextBoxEditor, IBaseTextBoxEditorProps} from './BaseTextBoxEditor';
    import {TextBox, ITextBoxSpecificProps} from './TextBox';
    import * as React from 'react';
    
    export interface ITextBoxEditorProps extends IBaseTextBoxEditorProps, ITextBoxSpecificProps, React.Props<TextBoxEditor> {

    }

    export class TextBoxEditor extends BaseTextBoxEditor<ITextBoxEditorProps> {
        constructor(props: ITextBoxEditorProps) {
            super(props);
        }

        protected getInput() {
            return (
                <TextBox
                    {...this.props as any}
                    id={ this.state.inputGroupId }
                    onValidationResultChange={ (isValid: boolean, errors: string[]) => this.onValidationResultChange(isValid, errors) }
                />
            );
        }
    }
