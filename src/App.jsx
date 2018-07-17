import React from 'react';
import Page1 from './Page1.js';
import Page2 from './Page2.js';
import Document from './Document.js';
import Login from './Login.js';
import Register from './Register.js';
import RaisedButton from 'material-ui/RaisedButton';
import { Editor, EditorState, RichUtils } from 'draft-js';
import io from 'socket.io-client';


export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentPage: 'Home',
      socket: io('http://localhost:8080'),
      authenticated: false

    };
    this.redirect = this.redirect.bind(this);

  }

  componentDidMount() {

  //  this.state.socket.emit('ping')
    this.state.socket.on('connect', function(){console.log('ws connect')});
    this.state.socket.on('disconnect', function(){console.log('ws disconnect')});
    this.state.socket.on('msg', function(data){
      console.log('ws msg:', data);
      this.state.socket.emit('cmd', {foo:123})
    });
    this.toggleAuthenticateStatus = () => {
      this.setState({ authenticated: Auth.isUserAuthenticated() })
    }
  }




  redirect(page) {
    this.setState({ currentPage: page });
  }

  render() {
    console.log(this.state.currentPage);
    return (
      <div>
      <h2>Horizons Docs</h2>
      { this.state.currentPage === 'Home' ?
      <div><button onClick={() => this.redirect('Register')}> Sign up</button>
      <button onClick={() => this.redirect('Login')}> Sign in</button>
      <button onClick={() => this.redirect('Document')}>Document</button></div> : null }
      { this.state.currentPage === 'Login' ? <Login redirect={this.redirect} /> : null }
      { this.state.currentPage === 'Register' ? <Register redirect={this.redirect} /> : null }
      { this.state.currentPage === 'Page1' ? <Page1 redirect={this.redirect} /> : null }
      { this.state.currentPage === 'Page2' ? <Page2 redirect={this.redirect} /> : null }
      { this.state.currentPage === 'Document' ? <Document redirect={this.redirect} /> : null }
      </div>
    );
  }
}
