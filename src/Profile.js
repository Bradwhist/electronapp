import React from 'react';
import axios from 'axios';
import Modal from 'react-modal';

const modalStyles = {
  content : {
    top                   : '50%',
    left                  : '50%',
    right                 : 'auto',
    bottom                : 'auto',
    marginRight           : '-50%',
    transform             : 'translate(-50%, -50%)'
  }
};

export default class Profile extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      ownDocs: [],
      collabDocs: [],
      currentId: null,
      modalIsOpen: false,
      docTitle: '',
      docPass: '',
      modalToggle: true,
      searchDocs: [],
      searchStr: '',
    }
    this.openModal = this.openModal.bind(this);
    this.afterOpenModal = this.afterOpenModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
  }

  ///Modal Functions//
  openModal() {
    this.setState({modalIsOpen: true});
  }

  afterOpenModal() {
    // references are now sync'd and can be accessed.
    this.subtitle.style.color = '#f00';
  }

  closeModal() {
    this.setState({modalIsOpen: false});
  }

  openCreateModal() {
    this.setState({modalToggle: true});
    this.openModal();
  }

  openSearchModal() {
    this.setState({modalToggle: false});
    this.openModal();
  }
  ///////////////////////

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
  docTitleChange(e) {
    this.setState({docTitle: e.target.value})
  }
  docPassChange(e) {
    this.setState({docPass: e.target.value})
  }
  docInit() {
    axios({
      method: 'post',
      url: 'http://localhost:3000/auth/doc',
      data: {
        title: this.state.docTitle,
        pass: this.state.docPass,
      }
    })
    .then(response => this.props.onNewDoc(response.data))
    // .then(response => response.json())
    // .then(response => )
  }

  async searchChange(e) {
    await this.setState({searchStr: e.target.value})
    this.searchInit();
  }
  searchInit() {
    console.log(this.state.searchStr)
    if (this.state.searchStr) {
    axios({
      method: 'GET',
      url: 'http://localhost:3000/auth/doc/search/' + this.state.searchStr,
    })
    .then(response => {this.setState({searchDocs: response.data})})
    .catch(err => console.log(err))
  } else {
    this.setState({searchDocs: []});
  }
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

    console.log(this.state.searchDocs);
    return (
      <div>
        <h2 className="profile">User Profile</h2>

        <button onClick={() => this.openSearchModal()}>Search for document</button>
        <button onClick={this.logout.bind(this)}>Logout</button>
        <button onClick={() => this.testDocs()}>Test doc loader</button>
        <button onClick={() => this.openCreateModal()}>Create Document</button>
        {this.state.modalToggle ?
          <Modal
          isOpen={this.state.modalIsOpen}
          onAfterOpen={this.afterOpenModal}
          onRequestClose={this.closeModal}
          style={modalStyles}
          contentLabel="Example Modal"
          >

          <h2 ref={subtitle => this.subtitle = subtitle}>Add Conspirators</h2>
          <button onClick={this.closeModal}>close</button>

          <input type="text" name="user" value={this.state.docTitle}
          onChange={this.docTitleChange.bind(this)}/>
          <input type="text" name="pass" value={this.state.docPass}
          onChange={this.docPassChange.bind(this)}/>
          <button onClick={() => this.docInit()}>Login</button>

        </Modal>
        :
        <Modal
        isOpen={this.state.modalIsOpen}
        onAfterOpen={this.afterOpenModal}
        onRequestClose={this.closeModal}
        style={modalStyles}
        contentLabel="Example Modal"
        >
        <h2 ref={subtitle => this.subtitle = subtitle}>Docs Matching</h2>
        <button onClick={this.closeModal}>close</button>
        <input type="text" name="searchStr" value={this.state.searchStr}
        onChange={(e) => this.searchChange(e)}/>
        <button onClick={() => this.searchInit()}>Search</button>
        <ul>
        {this.state.searchDocs.map(doc => (
          <li>
            <p>{doc.title}---{doc.ownerName}</p>
            <button onClick={() => this.props.onNewDoc(doc)}>Edit</button>
          </li>
        ))}
        </ul>
        </Modal>
      }
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
