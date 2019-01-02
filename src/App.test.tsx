import * as React from 'react';
import * as ReactDOM from 'react-dom';

import * as TestUtils from 'react-dom/test-utils';

import App from './App';


it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<App />, div);
  ReactDOM.unmountComponentAtNode(div);
});

it('open lightbox', () => {
  const div = document.createElement('div');
  ReactDOM.render(<App />, div);

  let requestButton=div.querySelector('.content button');
  let popup = div.querySelector('.lightbox-wrapper');

  expect(popup.parentElement.querySelector('div').style.display).toBe('none');
  TestUtils.Simulate.click(requestButton);
  expect(popup.parentElement.querySelector('div').style.display).toBe('block');

});