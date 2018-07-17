import React from 'react';
import {Editor, EditorState, RichUtils} from 'draft-js';
import RaisedButton from 'material-ui/RaisedButton';
import { withBaseIcon } from 'react-icons-kit';
import { listNumbered } from 'react-icons-kit/icomoon';
import {list2} from 'react-icons-kit/icomoon';

const SideIconContainer =
    withBaseIcon({ size: 20, style: {top:'50%', height:'10em', marginTop:'-5em', width:'100%'}})

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
            <RaisedButton style={{fontWeight:'bold'}} onMouseDown={(e) => this.toggleInlineStyle(e, 'BOLD')}>B</RaisedButton>
            <RaisedButton style={{fontStyle:'italic'}} onMouseDown={(e) => this.toggleInlineStyle(e, 'ITALIC')}>I</RaisedButton>
            {/* <RaisedButton {{textDecoration:'underline'}} onMouseDown={(e) => this.toggleInlineStyle(e, 'UNDERLINE')}>U</RaisedButton>
            <RaisedButton {{textDecoration:'line-through'}} onMouseDown={(e) => this.toggleInlineStyle(e, 'STRIKETHROUGH')}>S</RaisedButton> */}
            <RaisedButton onMouseDown={(e) => this.toggleInlineStyle(e, 'UPPERCASE')}>A</RaisedButton>
            <RaisedButton onMouseDown={(e) => this.toggleInlineStyle(e, 'LOWERCASE')}>a</RaisedButton>

            <RaisedButton onMouseDown={(e) => this.toggleBlockType(e, 'unordered-list-item')}>
              <SideIconContainer icon={list2}/>
            </RaisedButton>

            <RaisedButton onMouseDown={(e) => this.toggleBlockType(e, 'ordered-list-item')}>
              <SideIconContainer icon={listNumbered}/>
            </RaisedButton>



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
