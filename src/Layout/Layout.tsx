import * as React from 'react';


export class Layout extends React.Component<any, any> {

  public render() {
    return (
      <div className="App text-center">
        <header>
          <h1>Broccoli & Co.</h1>
        </header>

        {this.props.children}

        <footer>
          <em>
            Made with * in Media
            <br />
            © 2019 Broccoli & Co. All rights reserved.
          </em>
        </footer>
      </div>
    );
  }
}
