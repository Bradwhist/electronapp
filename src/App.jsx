import React from 'react';
import Page1 from './Page1.js';
import Page2 from './Page2.js';
import Document from './Document.js';
import RaisedButton from 'material-ui/RaisedButton';
import { Editor, EditorState, RichUtils } from 'draft-js';
import io from 'socket.io-client';


export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentPage: 'Home',
      socket: io('http://localhost:8080'),

    };
    this.redirect = this.redirect.bind(this);

  }

  componentDidMount() {

  //  this.state.socket.emit('ping')
    this.state.socket.on('connect', function(){console.log('ws connect')});
    this.state.socket.on('disconnect', function(){console.log('ws disconnect')});
    this.state.socket.on('msg', function(data){
      console.log('ws msg:', data);
      this.state.socket.emit('cmd', {foo:123})
    });
  }




  redirect(page) {
    this.setState({ currentPage: page });
  }

  render() {
    console.log(this.state.currentPage);
    return (
      <div>
      <h2>Meoww</h2>
<<<<<<< HEAD
      <RaisedButton color="primary" onMouseDown={(e) => this._onBoldClick(e)}>Bold</RaisedButton>
      <Editor
        editorState={this.state.editorState}
        onChange={this.onChange}
      />
 
=======
>>>>>>> ecb75db0d126c3a5f2d3f83805653b0813e6ebd0
      { this.state.currentPage === 'Home' ? <div><h1>Home Page</h1><button onClick={() => this.redirect('Page1')}> Page 1 goooooo</button></div> : null }
      { this.state.currentPage === 'Page1' ? <Page1 redirect={this.redirect} /> : null }
      { this.state.currentPage === 'Page2' ? <Page2 redirect={this.redirect} /> : null }
      { this.state.currentPage === 'Document' ? <Document redirect={this.redirect} /> : null }
      </div>
    );
  }
}
