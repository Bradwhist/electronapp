import React from 'react';
import Newdoc from './Newdoc.js';
import Profile from './Profile.js';
import Document from './Document.js';
import Login from './Login.js';
import Register from './Register.js';
import RaisedButton from 'material-ui/RaisedButton';
import { Editor, EditorState, RichUtils } from 'draft-js';
import io from 'socket.io-client';
import axios from 'axios';
import { session } from 'electron';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentPage: 'Home',
      socket: io('http://localhost:8080'),
      isLogged: false,
      connecting: true,
      currentDoc: null,
      collaborators: [],
    };
    this.redirect = this.redirect.bind(this);

  }

  componentDidMount() {

  //  this.state.socket.emit('ping')
    this.state.socket.on('connect', () => this.setState({connecting: null}));
    this.state.socket.on('disconnect', () => this.setState({connecting: false}));
    // this.state.socket.on('msg', function(data){
    //   console.log('ws msg:', data);
      //this.state.socket.emit('cmd', {foo:123})


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

//     session.defaultSession.cookies.get({}, function(error, cookies) {
//   console.log(error, cookies)
// })
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
  onNewDoc(doc) {
    this.setState({
      currentDoc: doc._id,
      currentPage: 'Document',
      collaborators: doc.collaboratorList,
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
      <button onClick={() => this.redirect('Document')}>Document</button>
      </div>
      :
      <div>
      <button onClick={() => this.redirect('Profile')}> My Profile</button>
      <button onClick={() => this.onLogout()}>Logout</button>
      <button onClick={() => this.redirect('Document')}>Document</button>
      </div>
      }

      </div>: null}

      { this.state.currentPage === 'Login' ? <Login redirect={this.redirect} onLogin={() => this.onLogin()} /> : null }
      { this.state.currentPage === 'Register' ? <Register redirect={this.redirect} /> : null }
      { this.state.currentPage === 'Newdoc' ? <Newdoc redirect={this.redirect} /> : null }
      { this.state.currentPage === 'Profile' ? <Profile redirect={this.redirect} onLogout={() => this.onLogout()} onNewDoc={(docId) => this.onNewDoc(docId)} /> : null }
      { this.state.currentPage === 'Document' ? <Document collaborators={this.state.collaborators} currentDoc={this.state.currentDoc} redirect={this.redirect} /> : null }

      </div>
    );
  }
}
