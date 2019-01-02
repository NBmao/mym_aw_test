
    import * as Enums from './Enums';
    import * as React from 'react';
    import { ValidationErrorsContainer} from './ValidationErrorsContainer';

    export interface IBaseEditorProps {
        label?: string;

        tooltip?: string;

        tooltipPosition?: Enums.Position;
        
        errorsWrapperCss?: string;

        cssWrapper?: string;
    }

    export interface IEditorState {
        isValid?: boolean;

        validationErrors?: string[];

        inputGroupId?: string;
    }

    export abstract class BaseEditor<TProps extends IBaseEditorProps> extends React.Component<TProps, IEditorState> {
        protected wrapperRef: HTMLElement;

        constructor(props: TProps) {
            super(props);
            this.state = this.getDefaultState();
        }

        public abstract render(): JSX.Element;

        protected getDefaultState(): IEditorState {
            return {
                isValid: true,
                validationErrors: new Array<string>()
            };
        }

        protected getTooltip(): JSX.Element {
            if (!this.props.tooltip || !this.props.tooltip.length) {
                return null;
            }

            return (null
                // <Html.Components.Tooltip
                //     htmlText={this.props.tooltip }
                //     position={ this.props.tooltipPosition}
                //     />

            );
        }

        protected onValidationResultChange(isValid: boolean, validationErrors: string[]) {
            this.setState({
                isValid: isValid,
                validationErrors: validationErrors
            });
        }

        protected getValidationErrorsContainer(): JSX.Element {
            return (
                <ValidationErrorsContainer validationErrors={ this.state.validationErrors } />
            );
        }
    }