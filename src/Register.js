import React from 'react';


export default class Register extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      user: '',
      pass: ''
    }
  }

  clickHandler() {
  fetch('http://localhost:3000/register', {
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
  .catch(err => console.log("urgh", err));
}
  userChange(e) {
    this.setState({
      user: e.target.value
    })
  }

  passChange(e) {
    this.setState({
      pass: e.target.value
    })
  }

  render() {
    console.log(this.state);
    return (
      <div>
        <input type="text" name="user" value={this.state.user}
        onChange={this.userChange.bind(this)}/>
        <input type="text" name="pass" value={this.state.pass}
        onChange={this.passChange.bind(this)}/>
        <button onClick={this.clickHandler.bind(this)}>Register</button>
        <button onClick={() => this.props.redirect("Page1")}>Go to Page 1</button>
      </div>
    )
  }
}
