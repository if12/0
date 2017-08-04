import React, { Component } from 'react';
import ReactDOM from 'react-dom';

class HelloReact extends Component {
  render() {
    return <div>Hello React</div>;
  }
}

ReactDOM.render(<HelloReact />, document.getElementById('app'));
