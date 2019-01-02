import * as React from 'react';
import './App.css';

import * as Constant from './constant';
import * as RegExPatterns from './Components/RegExPatterns';
import {Button} from './Components/Button';
import {LightBox} from './Components/LightBox';
import {TextBoxEditor} from './Components/TextBoxEditor';
import {FormComponent} from './Components/FormComponent';
import {ValidationErrorsContainer} from './Components/ValidationErrorsContainer';
import {Layout} from './Layout/Layout';
import * as Api from './Components/Api';

export interface IAppProps {
  className?: string;
}

export interface IAppState {
  showLightbox?: boolean;
  apiStatus?: Api.ActionType;
  email?: string;
  fullname?: string;
  errors?: Array<string>;
}

class App extends FormComponent<IAppProps, IAppState> {

  constructor(props: IAppProps) {
      super(props);
      this.state = this.getDefaultState()
  }

  private getDefaultState(){

    let defaultState={
      showLightbox: false,
      errors: [],
      apiStatus: Api.ActionType.Init,
      email:"",
      fullname:""
    }
    
    return defaultState;
  }

  //handle API
  private startLoading(){
    this.setState({apiStatus: Api.ActionType.Loading})
  }

  private handleApiSuccess(res){
    this.setState({apiStatus: Api.ActionType.Success, errors:[]})
  }

  private handleApiError(error){
    this.setState({apiStatus: Api.ActionType.Error, errors:[error.errorMessage]})
  }

  private submitForm(){
    let data={name:this.state.fullname, email: this.state.email}
    let self=this;

    this.startLoading();

    Api.Actions.post(Constant.Url, data).then(function(result){
      self.handleApiSuccess(result);
    },function(error){
      self.handleApiError(error)
    })
  }


  // render Form
  private showInviteForm(){
    this.setState({showLightbox: true})
  }

  private renderInviteForm(){
    return (
      <section className="popup-content">
        <h2>Request an invite</h2>
        <form className="popup-form" onSubmit={ (e: any) =>{
            e.preventDefault();
            if (this.isValid()) {
              this.submitForm();
            }
          }}
        >
          <TextBoxEditor 
            placeholder="Full name"
            required="This field is required"
            onBlur={val => this.setState({fullname: val})}
            regex={ {value: RegExPatterns.Alphabetical3, errorMessage: "Please input at least 3 characters long"} }
          />

          <TextBoxEditor 
            placeholder="Email"
            isEmail="Please enter your email address." 
            onBlur={val => this.setState({email: val})}
            required="This field is required"
          />
     
          <TextBoxEditor
            placeholder="Confirm Email"
            onBlur={val => null}
            required="This field is required"
            validationRules={
              	[
              		{
              			errorMessage: "Your email input not match",
              			validator: (val) => val==this.state.email
              		}
              	] 
            }
          />

          <Button type="submit" disabled={this.state.apiStatus==Api.ActionType.Loading}> 
            {this.state.apiStatus==Api.ActionType.Loading?Constant.Text.SendingButton: Constant.Text.InitButton} 
          </Button>

          <ValidationErrorsContainer isServerError={this.state.apiStatus==Api.ActionType.Error} validationErrors={ this.state.errors} />
        </form>
      </section>
    )
  }

  private renderDoneForm(){
    return (
      <section className="popup-content popup-form text-center">
        <h2>All Done !</h2>
        <p>{Constant.Text.SuccessMsg}</p>
        <Button type="button" onClick={()=> this.setState(this.getDefaultState())}> OK  </Button>
      </section>
    )
  }

  public render() {
    return (
      <Layout>

        <LightBox 
          footBtn={[]}
          contentClass="lightbox-content"
          isShow={this.state.showLightbox}
          closeBtnLabel="Close X"
          content={this.state.apiStatus==Api.ActionType.Success?this.renderDoneForm():this.renderInviteForm()}
          onClose={()=>{
            this.setState({showLightbox:false})
        }}/>

        <div className="content">
          <div className="center">
            <p> A batter Way<br />to enjoy every day </p>
            
            <Button type="button" onClick={()=> this.showInviteForm()}>
              Request an Inviste
            </Button>

          </div>
        </div>
  
      </Layout>

    );
  }
}

export default App;