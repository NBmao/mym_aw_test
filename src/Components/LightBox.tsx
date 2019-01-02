    import * as React from 'react';
    import {Button} from './Button';

    export interface ILightBoxProps {
        className?: string;
        title?: React.ReactNode;
        content?: any;
        onClose?: () => void;
        onOK?: () => void;
        onCloseTxt?:string;
        onOkTxt?:string;
        isShow:boolean;
        isShowTopRightCloseBtn?:boolean;
        //if footBtn=[] will not show footer button
        footBtn?:JSX.Element[];
        isFull?:boolean;
        showHeader?:boolean;
        contentClass?:string;
        closeBtnLabel?:string;
        isShowCloseBtnLabel?:boolean;
    }

    export interface ILightBoxState {
        isShow?: boolean;
    }

    export class LightBox extends React.Component<ILightBoxProps, ILightBoxState> {

        private static defaultProps = {
            isShowTopRightCloseBtn:true,
            isFull:false,
            showHeader:false,
            contentClass:"lightbox-content-600",
            closeBtnLabel:"Exit",
            isShowCloseBtnLabel:false
        };

        constructor(props: ILightBoxProps) {
            super(props);
            this.state = {
                isShow: this.props.isShow
            }
        }


        public componentWillReceiveProps(nextProps:ILightBoxProps) {
            if (nextProps.isShow !== this.props.isShow) {
                this.setState({ isShow: nextProps.isShow });
            }
        }
        private onClose() {
            let self = this;
            const { onClose } = self.props;
            const { isShow } = self.state;
            self.setState({ isShow: false });
            if (onClose) {
                onClose();
            }
        }
        private onOk() {
            let self = this;
            const { onOK } = self.props;
            if (onOK) {
                onOK();
            }
        }
        public renderHeader() {
            return <div className="site-header">
                <header className="container no-nav">
                    <button className="mobile-nav-toggle-button">
                        <span className="sr-only">Toggle navigation</span>
                        <span className="icon-bar icon-bar-1"></span>
                        <span className="icon-bar icon-bar-2"></span>
                        <span className="icon-bar icon-bar-3"></span>
                    </button>
                    <a href="#" className="logo-wrapper" title="UOB">
                        <div className="logo"><span className="sr-only">logo</span></div>
                    </a>
                    <div className="stamp"><span className="sr-only">This is an image of UOB Logo Strap</span></div>
                </header>
            </div>
        }
        public renderFootBtn() {
            const { footBtn, onClose, onOK, onOkTxt, onCloseTxt,contentClass } = this.props;
            let _contentClassName=contentClass+" content-center";

            if (!footBtn) {
                return <div className={_contentClassName}>
                    <Button className="btn-primary" onClick={() => this.onOk()}>{onOkTxt ? onOkTxt : "OK"} </Button>
                    <Button className="btn-secondary ml-150" onClick={() => this.onClose()}>{onCloseTxt ? onCloseTxt : "Close"} </Button>
                </div>
            } else {
                return <div className={_contentClassName}>
                    {footBtn.map(item => item)}
                </div>
            }
        }
        public render(): JSX.Element {
            let self = this;
            let basciClass = "lightbox-wrapper  lightbox-center";
            const { className, title, content,isShowTopRightCloseBtn,footBtn, onClose, onOK,isFull,showHeader,contentClass,closeBtnLabel,isShowCloseBtnLabel } = self.props;
            const { isShow } = self.state;
            if(showHeader){
                 basciClass = "lightbox-wrapper lightbox-center with-header";
            }
            if(isFull){
                basciClass="lightbox-wrapper lightbox-content-top";

                if(showHeader){
                    basciClass = "lightbox-wrapper lightbox-content-top with-header";
                }
            }
            let _className = className ? (basciClass + className) : basciClass;
            let _closeBtnLabelClass=isShowCloseBtnLabel ? "" : "sr-only";
            
            return (<div className={_className} style={{ display: isShow ? 'block' : 'none' }}>

                <div className="lightbox-layer"></div>

                <div className="lightbox-container" role="dialog">
                    <div className="lightbox-position">
                        <div className="lightbox-window">
                            {showHeader ? this.renderHeader() : null}

                            {isShowTopRightCloseBtn
                                ? <Button className="lightbox-close" onClick={() => this.onClose()}>
                                    <span className={_closeBtnLabelClass}>{closeBtnLabel}</span>
                                </Button>
                                : null}

                            <div className={contentClass}>
                                <h1 className="lightbox-title">{title}</h1>
                                {content}
                            </div>

                            {this.renderFootBtn()}
                        </div>
                    </div>
                </div>
            </div>)
        }
    }
