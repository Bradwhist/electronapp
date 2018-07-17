import React from 'react';

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
    fetch('http://localhost:3000/login', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        user: this.state.user,
        pass: this.state.pass,
      })
    })
    .then(response => response.json())
    .then(response => this.setState({
      user: response.user,
    }))
    .catch(err => console.log("login error", err));
  }

  render() {
    return (
      <div>
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
