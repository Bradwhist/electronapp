import React from 'react';
import Newdoc from './Newdoc.js';
import Profile from './Profile.js';
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
      isLogged: false,
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


  }


  redirect(page) {
    this.setState({ currentPage: page });
  }

  onLogin() {
    // fetch('http://localhost:3000/auth/currentUser', {
    //   method: 'GET',
    // })
    // .then(res => res.json())
    // .then(result => {
    //   if (result) {
    //     this.setState({
    //       isLogged: true,
    //     })
    //     console.log('this.state.isLogged', this.state.isLogged);
    //   }
    // }
    // )
    // .catch(err => console.log(err))
    this.setState({
      isLogged: true,
    })
    console.log('this.state.isLogged');
  }
  onLogout() {
    this.setState({
      isLogged: false,
    })
  }

  render() {
    
    console.log(this.state.isLogged);
    return (
      <div>
      <h2>Horizons Docs</h2>
      <button onClick={() => this.redirect("Home")}>Go Home</button>
      {this.state.currentPage === 'Home' ?
      <div>
      { !this.state.isLogged ?
        <div>
      <button onClick={() => this.redirect('Register')}> Sign up</button>
      <button onClick={() => this.redirect('Login')}> Sign in</button>
      </div>
      :
      <div>
      <button onClick={() => this.redirect('Profile')}> My Profile</button>
      <button onClick={() => this.onLogout()}>Logout</button>
      </div>
      }

      </div>: null}

      { this.state.currentPage === 'Login' ? <Login redirect={this.redirect} onLogin={() => this.onLogin()} /> : null }
      { this.state.currentPage === 'Register' ? <Register redirect={this.redirect} /> : null }
      { this.state.currentPage === 'Newdoc' ? <Newdoc redirect={this.redirect} /> : null }
      { this.state.currentPage === 'Profile' ? <Profile redirect={this.redirect} onLogout={() => this.onLogout()} /> : null }
      { this.state.currentPage === 'Document' ? <Document redirect={this.redirect} /> : null }

      </div>
    );
  }
}
