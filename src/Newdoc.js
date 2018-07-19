import React from 'react';

export default class Newdoc extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      content: [],
      owner: {},
      collaboratorList: {},
      title: '',
      password: '',
      createdTime: '',
      lastEditTime: '',
    }
  }

  titleChange(e) {
    this.setState({
      title: e.target.value,
    })
  }
  passChange(e) {
    this.setState({
      password: e.target.password,
    })
  }
  clickHandler() {
    this.setState({
      createdTime: new Date,
      lastEditTime: new Date,
    })
    fetch('http://localhost:3000/doc', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        content: this.state.content,
        owner: this.state.owner,
        collaboratorList: this.state.collaboratorList,
        title: this.state.title,
        password: this.state.password,
        createdTime: this.state.createdTime,
        lastEditTime: this.state.lastEditTime,
      })
    })
    .then(response => response.json())
    .then(response => this.setState({
      doc: response.doc,
    }))
    .catch(err => console.log("new doc error", err));
  }

  render() {
    return (
      <div>
      <div>
        <h2 className="page1">New Doc</h2>

      </div>
      <div>
      <input type="text" name="title" value={this.state.title}
      onChange={this.titleChange.bind(this)}/>
      <input type="text" name="pass" value={this.state.password}
      onChange={this.passChange.bind(this)}/>
      <button onClick={this.clickHandler.bind(this)}>Create Doc</button>
      
      <button onClick={() => this.props.redirect("Page2")}>Go to Page 2</button>
      </div>
      </div>
    )
  }
}
