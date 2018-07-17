import React from 'react';
import {Editor, EditorState, RichUtils} from 'draft-js';
import RaisedButton from 'material-ui/RaisedButton';

import ColorPicker, { colorPickerPlugin } from 'draft-js-color-picker';
// import 'react-color-picker/index.css'

const presetColors = [
  '#ff00aa',
  '#F5A623',
  '#F8E71C',
  '#8B572A',
  '#7ED321',
  '#417505',
  '#BD10E0',
  '#9013FE',
  '#4A90E2',
  '#50E3C2',
  '#B8E986',
  '#000000',
  '#4A4A4A',
  '#9B9B9B',
  '#FFFFFF',
];

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
    this.getEditorState = () => this.state.editorState;
    this.picker = colorPickerPlugin(this.onChange, this.getEditorState)
  }

  toggleInlineStyle(e, inlineStyle) {
    e.preventDefault();
    this.onChange(RichUtils.toggleInlineStyle(this.state.editorState, inlineStyle))
  }

  toggleBlockType(e, blockType) {
    e.preventDefault();
    this.onChange(RichUtils.toggleBlockType(this.state.editorState, blockType))
  }

  alignRight(e, direction) {
    this.onChange(RichUtils.toggleBlockType(this.state.editorState, 'right'))
  }

  alignLeft(e, direction) {
    this.onChange(RichUtils.toggleBlockType(this.state.editorState, 'left'))
  }

  alignCenter(e, direction) {
    this.onChange(RichUtils.toggleBlockType(this.state.editorState, 'center'))
  }

  myBlockStyleFn(contentBlock) {
  const type = contentBlock.getType();
  if (type === 'right') {
    return 'align-right';
  } else if (type === 'left') {
    return 'align-left'
  } else if (type === 'center') {
    return 'align-center'
  }
}

  render() {
    return(
      <div>
        <h1>Document Editor</h1>
        <div className="editor">
          <div className="toolbar">
            {/* <RaisedButton style={{fontWeight:'bold'}} onMouseDown={(e) => this.toggleInlineStyle(e, 'BOLD')}>B</RaisedButton>
            <RaisedButton style={{fontStyle:'italic'}} onMouseDown={(e) => this.toggleInlineStyle(e, 'ITALIC')}>I</RaisedButton>
            <RaisedButton {{textDecoration:'underline'}} onMouseDown={(e) => this.toggleInlineStyle(e, 'UNDERLINE')}>U</RaisedButton>
            <RaisedButton {{textDecoration:'line-through'}} onMouseDown={(e) => this.toggleInlineStyle(e, 'STRIKETHROUGH')}>S</RaisedButton>
            <RaisedButton onMouseDown={(e) => this.toggleInlineStyle(e, 'UPPERCASE')}>A</RaisedButton>
            <RaisedButton onMouseDown={(e) => this.toggleInlineStyle(e, 'LOWERCASE')}>a</RaisedButton> */}

            <button onMouseDown={(e) => this.toggleInlineStyle(e, 'BOLD')}>B</button>
            <button onMouseDown={(e) => this.toggleInlineStyle(e, 'ITALIC')}>I</button>
            <button onMouseDown={(e) => this.toggleInlineStyle(e, 'UNDERLINE')}>U</button>
            <button onMouseDown={(e) => this.toggleInlineStyle(e, 'STRIKETHROUGH')}>S</button>
            <button onMouseDown={(e) => this.toggleInlineStyle(e, 'UPPERCASE')}>ABC</button>
            <button onMouseDown={(e) => this.toggleInlineStyle(e, 'LOWERCASE')}>xyz</button>

            <button onMouseDown={(e) => this.toggleBlockType(e, 'unordered-list-item')}> Unordered List</button>
            <button onMouseDown={(e) => this.toggleBlockType(e, 'ordered-list-item')}> Ordered List</button>
            <button onMouseDown={(e) => this.alignRight(e)}>Align Right</button>
            <button onMouseDown={(e) => this.alignLeft(e)}>Align Left</button>
            <button onMouseDown={(e) => this.alignCenter(e)}>Center</button>


              <div style={{display: 'flex', padding: '15px'}}>
                <div style={{ flex: '1 0 25%' }}>
                  <ColorPicker
                    toggleColor={color => this.picker.addColor(color)}
                    presetColors={presetColors}
                    color={this.picker.currentColor(this.state.editorState)}/>
                    <button onClick={this.picker.removeColor}>clear</button>
                  </div>
                </div>

              </div>
              <Editor
                customStyleFn={this.picker.customStyleFn}
                editorState={this.state.editorState}
                onChange={this.onChange}
                customStyleMap={styleMap}
                blockStyleFn={this.myBlockStyleFn}
              />
            </div>
            <button onClick={() => this.props.redirect("Home")}>Home James</button>
          </div>
        )
      }
    }
