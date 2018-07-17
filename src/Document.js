import React from 'react';
import {Editor, EditorState, RichUtils} from 'draft-js';
import RaisedButton from 'material-ui/RaisedButton';

const styleMap = {
  'UPPERCASE': {
    textTransform: 'uppercase'
  },
  'LOWERCASE': {
    textTransform: 'lowercase'
  }
}
export default class Document extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      editorState: EditorState.createEmpty(),
      // socket: io('http://localhost:8080'),
    }
    this.onChange = (editorState) => this.setState({editorState});
  }

  toggleInlineStyle(e, inlineStyle) {
    e.preventDefault();
    this.onChange(RichUtils.toggleInlineStyle(this.state.editorState, inlineStyle))
  }

  toggleBlockType(e, blockType) {
    e.preventDefault();
    this.onChange(RichUtils.toggleBlockType(this.state.editorState, blockType))
  }

  render() {
    return(
      <div>
        <h1>Document Editor</h1>
        <div className="editor">
          <div className="toolbar">

            <RaisedButton onMouseDown={(e) => this.toggleInlineStyle(e, 'BOLD')}>B</RaisedButton>
            <RaisedButton onMouseDown={(e) => this.toggleInlineStyle(e, 'ITALIC')}>I</RaisedButton>
            <RaisedButton onMouseDown={(e) => this.toggleInlineStyle(e, 'UNDERLINE')}>U</RaisedButton>
            <RaisedButton onMouseDown={(e) => this.toggleInlineStyle(e, 'STRIKETHROUGH')}>S</RaisedButton>
            <RaisedButton onMouseDown={(e) => this.toggleInlineStyle(e, 'UPPERCASE')}>ABC</RaisedButton>
            <RaisedButton onMouseDown={(e) => this.toggleInlineStyle(e, 'LOWERCASE')}>xyz</RaisedButton>

            <RaisedButton onMouseDown={(e) => this.toggleBlockType(e, 'unordered-list-item')}> Unordered List</RaisedButton>
            <RaisedButton onMouseDown={(e) => this.toggleBlockType(e, 'ordered-list-item')}> Ordered List</RaisedButton>



          </div>
        <Editor
          editorState={this.state.editorState}
          onChange={this.onChange}
          customStyleMap={styleMap}
        />
      </div>
        <button onClick={() => this.props.redirect("Home")}>Home James</button>
      </div>
    )
  }
}
