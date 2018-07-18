import React from 'react';

export default class Profile extends React.Component {
  constructor(props) {
    super(props)
  }
  logout() {
    fetch('http://localhost:3000/auth/logout', {
      method: 'GET'
    })
    .then(
    this.props.redirect("Home")
    )
    .then(
      this.props.onLogout()
    )
    .catch(err => console.log("logout error", err));
  }
  render() {
    return (
      <div>
        <h2 className="profile">User Profile</h2>
        <button onClick={() => this.props.redirect("Document")}>New Document Page</button>
        <button onClick={this.logout.bind(this)}>Logout</button>
      </div>
    )
  }
}
