import React from 'react';
import axios from 'axios';


export default class Profile extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      docs: [],
    }

  }
  updateDocs = () => {
  axios({
    method: 'get',
    url: 'http://localhost:3000/auth/doc',

  })
  .then(response => {
    this.setState({docs: response.data})
  })
  .catch(err => console.log(err))

}


  componentDidMount () {
    this.updateDocs()

}

  componentWillMount () {


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
  clickHandler() {
    axios({
      method: 'post',
      url: 'http://localhost:3000/auth/doc',
      data: {}
    })
    .then(response => this.props.onNewDoc(response.data._id))
    // .then(response => response.json())
    // .then(response => )

  }
  render() {
    console.log(this.state.docs);
    return (
      <div>
        <h2 className="profile">User Profile</h2>
        <button onClick={() => this.clickHandler()}>New Document</button>
        <button onClick={this.logout.bind(this)}>Logout</button>
        <h1>All Docs</h1>
        <ul>
        {this.state.docs.map(doc => (
          <li>
            <p>{doc.title}---{doc.owner}</p>
            <button onClick={() => this.props.onNewDoc(doc._id)}>Edit</button>
          </li>
        ))}
        </ul>

      </div>
    )
  }

}
