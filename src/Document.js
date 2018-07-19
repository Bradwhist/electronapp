import React from 'react';
import {Editor, EditorState, RichUtils} from 'draft-js';
import RaisedButton from 'material-ui/RaisedButton';
import ColorPicker, { colorPickerPlugin } from 'draft-js-color-picker';
// import 'react-color-picker/index.css'

import {withBaseIcon} from 'react-icons-kit';
import {listNumbered, list2, paragraphLeft, paragraphCenter, paragraphRight,
  bold, italic, underline, strikethrough
} from 'react-icons-kit/icomoon';
import {u1F1F9} from 'react-icons-kit/noto_emoji_regular'
import {tumblr} from 'react-icons-kit/entypo'

import Dropdown from 'react-dropdown'

const options = [
  'Arial', 'Times New Roman', 'American Typewriter', 'Courier New', 'Courier',
  'Monaco', 'Arial Rounded MT Bold', 'Helvetica', 'Baskerville', 'Georgia',
  'Garamond', 'Bookman Old Style', 'Brush Script M7', 'Comic Sans', 'Didot',
  'Futura', 'Impact', 'Gill Sans', 'Lucida Grande', 'Lucida Sans Unicode', 'Verdana',
  'Helvetica Neue', 'Hoefler Text', 'Marker Felt', 'Myriad', 'Optima', 'Palatino',
  'Book Antiqua', 'Cochin', 'Goudy Old Style'
]
const defaultOption = options[0]

const options1 = [
  'one', 'two', 'three'
]
const defaultOption1 = options1[0]

const SideIconContainer = withBaseIcon({
  size:'13',
  style: {
   borderRadius:'4px'
  }
})

const presetColors = [
  '#ff00aa','#F5A623','#F8E71C','#8B572A','#7ED321','#417505','#BD10E0','#9013FE',
  '#4A90E2','#50E3C2','#B8E986','#000000','#4A4A4A','#9B9B9B','#FFFFFF',
];

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
    this.picker = colorPickerPlugin(this.onChange, this.getEditorState);
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

  changeFont(e, font) {
    this.onChange(RichUtils.toggleInlineStyle(this.state.editorState, font))
  }


  render() {
    return(
      <div>
        <h1>Document Editor</h1>
        <div className="editor">
          <div className="toolbar">
            <button onMouseDown={(e) => this.toggleInlineStyle(e, 'BOLD')}>
              <SideIconContainer icon={bold}/>
            </button>
            <button onMouseDown={(e) => this.toggleInlineStyle(e, 'ITALIC')}>
              <SideIconContainer icon={italic}/>
            </button>
            <button onMouseDown={(e) => this.toggleInlineStyle(e, 'UNDERLINE')}>
              <SideIconContainer icon={underline}/>
            </button>
            <button onMouseDown={(e) => this.toggleInlineStyle(e, 'STRIKETHROUGH')}>
              <SideIconContainer icon={strikethrough}/>
            </button>
            <button onMouseDown={(e) => this.toggleInlineStyle(e, 'UPPERCASE')}>
              <SideIconContainer icon={u1F1F9}/>
            </button>
            <button onMouseDown={(e) => this.toggleInlineStyle(e, 'LOWERCASE')}>
              <SideIconContainer icon={tumblr}/>
            </button>
            <button onMouseDown={(e) => this.toggleBlockType(e, 'unordered-list-item')}>
              <SideIconContainer icon={list2}/>
            </button>
            <button onMouseDown={(e) => this.toggleBlockType(e, 'ordered-list-item')}>
              <SideIconContainer icon={listNumbered}/>
            </button>
            <button onMouseDown={(e) => this.alignLeft(e)}>
              <SideIconContainer icon={paragraphLeft}/>
            </button>
            <button onMouseDown={(e) => this.alignCenter(e)}>
              <SideIconContainer icon={paragraphCenter}/>
            </button>
            <button onMouseDown={(e) => this.alignRight(e)}>
              <SideIconContainer icon={paragraphRight}/>
            </button>
            <Dropdown options={options} onChange={this._onSelect} value={defaultOption} placeholder="Select a font"/>
            <div style={{display: 'flex', paddingTop: '10px', paddingBottom: '10px'}}>
              <div style={{ flex: '1 0 25%' }}>
                <ColorPicker
                  toggleColor={color => this.picker.addColor(color)}
                  presetColors={presetColors}
                  color={this.picker.currentColor(this.state.editorState)}/>
                <button onClick={this.picker.removeColor}>Default black</button>
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
