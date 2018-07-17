import React from 'react';
import {Editor, EditorState} from 'draft-js';
import RaisedButton from 'material-ui/RaisedButton';

export default class Document extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      editorState: EditorState.createEmpty(),
      // socket: io('http://localhost:8080'),
    }
        this.onChange = (editorState) => this.setState({editorState});
  }
  _onBoldClick(e) {
    e.preventDefault()
    this.onChange(RichUtils.toggleInlineStyle(this.state.editorState, 'BOLD'));
  }
  render() {
    return(
      <div>
        <h1>Document Editor</h1>
        <RaisedButton color="primary" onMouseDown={(e) => this._onBoldClick(e)}>Bold</RaisedButton>
        <Editor
          editorState={this.state.editorState}
          onChange={this.onChange}
        />
        <button onClick={() => this.props.redirect("Home")}>Home James</button>
      </div>
    )
  }
}
