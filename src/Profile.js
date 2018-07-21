import React from 'react';
import axios from 'axios';


export default class Profile extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      ownDocs: [],
      collabDocs: [],
      currentId: null,
    }

  }

  updateUser = () => {

    axios({
      method: 'get',
      url: 'http://localhost:3000/auth/currentUser'
    })
    .then(response => {

      this.setState({currentId: response.data.user._id});

    })
  }
  // updateUser = () => {
  //   var ret = "test"
  //   fetch('http://localhost:3000/auth/currentUser', {
  //     method: 'get',
  //     credentials: 'same-origin'
  //   })
  //   .then(response => {
  //
  //     console.log(response);
  //     return response.json();
  //
  //   })
  //   .then(responseJson => {
  //     console.log(responseJson.user._id);
  //     ret = responseJson.user._id
  //   })
  //   return ret;
  // }

  updateDocs = () => {

  axios({
    method: 'get',
    url: 'http://localhost:3000/auth/doc/own',

  })
  .then(response => {
    console.log(response.data);
    console.log(this.state.currentId);
    // var ownDocs = response.data.slice().filter(ele => {ele.owner === this.state.currentId})
    // var collabDocs = response.data.slice().filter(ele => {ele.owner !== this.state.currentId})
    console.log(response.data.filter(ele => {return ele.owner === this.state.currentId}));
    //console.log(collabDocs);
    this.setState({
      ownDocs: response.data.filter(ele => {return ele.owner === this.state.currentId}),
      collabDocs: response.data.filter(ele => {return ele.owner !== this.state.currentId}),
  })
  })
  .catch(err => console.log(err))

}



testDocs = () => {
  axios({
    method: 'get',
    url: 'http://localhost:3000/auth/doc/own'
  })
  .then(response => console.log(response));
}


  componentDidMount () {

    this.updateUser();
    this.updateDocs();

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
    .then(response => this.props.onNewDoc(response.data))
    // .then(response => response.json())
    // .then(response => )
  }
    // getUserName = (userId) => {
    //
    // var ret;
    // axios({
    //   method: 'get',
    //   url: 'http://localhost:3000/auth/user/id/' + userId,
    // })
    // .then(response => {
    //   ret = {
    //     key: response
    //   }
    // })
    // .catch(err => console.log(err))
    // console.log(ret.key);
    // return ret.key;
    // }
  render() {


    return (
      <div>
        <h2 className="profile">User Profile</h2>
        <button onClick={() => this.clickHandler()}>New Document</button>
        <button onClick={this.logout.bind(this)}>Logout</button>
        <button onClick={() => this.testDocs()}>Test doc loader</button>
        <h2>Your Docs</h2>
        <ul>
        {this.state.ownDocs.map(doc => (
          <li>
            <p>{doc.title}---{doc.ownerName}</p>
            <button onClick={() => this.props.onNewDoc(doc)}>Edit</button>
          </li>
        ))}
        </ul>
        <h2>Docs You Are Collaborating On</h2>
        <ul>
        {this.state.collabDocs.map(doc => (
          <li>
            <p>{doc.title}---{doc.ownerName}</p>
            <button onClick={() => this.props.onNewDoc(doc)}>Edit</button>
          </li>
        ))}
        </ul>

      </div>
    )
  }

}
