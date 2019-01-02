    import * as React from 'react';

    export interface IButtonProps extends React.Props<Button> {
        disabled?: boolean;
        
        className?: string;

        onClick?: (e: Event) => void;

        type?: string;

        tabIndex?: number;
    }

    export class Button extends React.Component<IButtonProps, any> {
        private _buttonRef: HTMLButtonElement;

        constructor(props: IButtonProps) {
            super(props);
        }


        public render(): JSX.Element {
            return (
                <button
                    type={ this.props.type ? this.props.type : "button" }
                    className={ this.props.className }
                    disabled={ this.props.disabled }
                    onClick={ (e) => this.onClick(e) }
                    ref={ (btn: HTMLButtonElement) => this._buttonRef = btn }
                    tabIndex={ this.props.tabIndex }
                    >
                    { this.props.children }
                </button>
                );
        }

        private onClick(e): any {
            if (this.props.onClick) {
                this.props.onClick(e);
            }
        }
    }