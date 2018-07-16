import React from 'react';
import Page1 from './Page1.js';
import Page2 from './Page2.js';
import RaisedButton from 'material-ui/RaisedButton';
import { Editor, EditorState, RichUtils } from 'draft-js';


export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentPage: 'Home',
      editorState: EditorState.createEmpty(),
    };
    this.redirect = this.redirect.bind(this);
    this.onChange = (editorState) => this.setState({editorState});
  }

  _onBoldClick(e) {
    e.preventDefault()
    this.onChange(RichUtils.toggleInlineStyle(this.state.editorState, 'BOLD'));
  }

  redirect(page) {
    this.setState({ currentPage: page });
  }

  render() {
    console.log(this.state.currentPage);
    return (
      <div>
      <h2>Meoww</h2>
      <RaisedButton color="primary" onMouseDown={(e) => this._onBoldClick(e)}>Bold</RaisedButton>
      <Editor
        editorState={this.state.editorState}
        onChange={this.onChange}
      />

      { this.state.currentPage === 'Home' ? <div><h1>Home Page</h1><button onClick={() => this.redirect('Page1')}> Page 1 goooooo</button></div> : null }
      { this.state.currentPage === 'Page1' ? <Page1 redirect={this.redirect} /> : null }
      { this.state.currentPage === 'Page2' ? <Page2 redirect={this.redirect} /> : null }
      </div>
    );
  }
}
 
