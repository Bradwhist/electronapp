import React from 'react';

export default class Login extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      user: '',
      pass: '',
    }
  }

  userChange(event) {
    this.setState({title: event.target.value})
  };

  passChange(event) {
    this.setState({pass: event.target.value})
  };

  clickHandler() {}

  render() {
    return (
      <div>
      <input type="text" name="user" value={this.state.user}
      onChange={this.userChange.bind(this)}/>
      <input type="text" name="pass" value={this.state.pass}
      onChange={this.passChange.bind(this)}/>
      <button onClick={this.clickHandler}>Words</button>
      </div>
    )
  }
}
