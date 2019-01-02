    import * as React from 'react';
    import * as Utils from './Utils';

    export interface IValidationErrorsContainerProps {
        validationErrors: string[];
        isServerError?: boolean;
    }

    export interface IValidationErrorsContainerState {
        validationErrors: string[];
    }

    export class ValidationErrorsContainer extends React.Component<IValidationErrorsContainerProps, IValidationErrorsContainerState> {
        constructor(props: IValidationErrorsContainerProps) {
            super(props);
            this.state = {
                validationErrors: props.validationErrors || []
            }
        }

        public componentWillReceiveProps(nextProps: IValidationErrorsContainerProps) {
            var isHidden = Utils.Arrays.isNullOrEmpty(nextProps.validationErrors);
            if (!isHidden) {
                this.setState({validationErrors: nextProps.validationErrors});
            }
        }

        public render() {
            var isHidden = Utils.Arrays.isNullOrEmpty(this.props.validationErrors);

            var errors = this.state.validationErrors;
            var errorsCode: any;
            if (!Utils.Arrays.isNullOrEmpty(errors)) {
                errorsCode = errors.map((e: string, index: number) =>
                    <span className='error' key={index}>{ e }</span>
                );
            }

            var className = (this.props.isServerError) ? 'error-message' : 'inline-error-message '+ (isHidden? 'is-hidden hidden':  "");

            return (
				<div className={className} role="alert">
					{ errorsCode }
				</div>
			);
        }
    }
