import React from 'react';
import axios from 'axios';
import { session } from 'electron';

export default class Login extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      user: '',
      pass: ''
    }
  }

  userChange(event) {
    this.setState({user: event.target.value})
  };

  passChange(event) {
    this.setState({pass: event.target.value})
  };

  clickHandler() {
    console.log(this.state.user);
    console.log(this.state.pass);
    // fetch('http://localhost:3000/auth/login', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json'
    //   },
    //   body: JSON.stringify({
    //     user: this.state.user,
    //     pass: this.state.pass,
    //   })
    // })
    axios({
      method: 'post',
      url: 'http://localhost:3000/auth/login',
      data: {
        user: this.state.user,
        pass: this.state.pass,
      }
    })
    // .then(response => response.json())
    .then(response => {
      console.log('login response');
      console.log(response);
      // this.setState({
      //   user: response.data.user,
      // })
      if (response) {
        this.props.onLogin();
        this.props.redirect('Profile')
      }


    })

    .catch(err => console.log("login error", err));
  }

  render() {
    return (
      <div>
      <h1>Log In</h1>
      <input type="text" name="user" value={this.state.user}
      onChange={this.userChange.bind(this)}/>
      <input type="text" name="pass" value={this.state.pass}
      onChange={this.passChange.bind(this)}/>
      <button onClick={this.clickHandler.bind(this)}>Login</button>
      <button onClick={() => this.props.redirect("Register")}>Sign Up</button>
      </div>
    )
  }
}
