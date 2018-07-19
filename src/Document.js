import React from 'react';
import {Editor, EditorState, RichUtils} from 'draft-js';
import RaisedButton from 'material-ui/RaisedButton';
// import ColorPicker, { colorPickerPlugin } from 'draft-js-color-picker';
// import createStyles from 'draft-js-custom-styles'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppBar from 'material-ui/AppBar';
import { CirclePicker } from 'react-color'
import Popover from 'material-ui/Popover';
import * as colors from 'material-ui/styles/colors'
import FontIcon from 'material-ui/FontIcon';

const customStyleMap = {
  remoteCursor: {
    borderLeft: 'solid 3px red'
  }
}

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

const styleMap = {
  'UPPERCASE': {
    textTransform: 'uppercase'
  },
  'LOWERCASE': {
    textTransform: 'lowercase'
  },
  remoteCursor: {
    borderLeft: 'solid 3px red'
  }
}

// const {
//   styles,
//   customStyleFn,
// } = createStyles(['font-size', 'color'], customStyleMap)

export default class Document extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      editorState: EditorState.createEmpty(),
      currentFontSize: 12,
      inlineStyles: {
        'UPPERCASE': {
        textTransform: 'uppercase'
      },
      'LOWERCASE': {
        textTransform: 'lowercase'
      },
      remoteCursor: {
        borderLeft: 'solid 3px red'
      }
    }
      // socket: io('http://localhost:8080'),
    }
    this.onChange = (editorState) => this.setState({editorState});
    this.getEditorState = () => this.state.editorState;
    // this.picker = colorPickerPlugin(this.onChange, this.getEditorState)
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

onSetStyle = (name, val) => (e) => {
    this.onChange(styles[name].toggle(this.state.editorState, val))

    e.preventDefault()
 }

 mark = (e) => {
    this.onChange(RichUtils.toggleInlineStyle(this.state.editorState, 'remoteCursor'))
    e.preventDefault()
  }

  formatColor(color) {
    var newInlineStyles = Object.assign(
      {},
      this.state.inlineStyles,
      {
        [color.hex]: {
          color: color.hex,
        }
      }
    )
    this.setState({
      inlineStyles: newInlineStyles,
      editorState: RichUtils.toggleInlineStyle(this.state.editorState, color.hex)
    })
  }

  openColorPicker(e) {
    this.setState({
      colorPickerOpen: true,
      colorPIckerButton: e.target
    })
  }

  closeColorPicker() {
    this.setState({
      colorPickerOpen: false
    })
  }

  colorPicker() {
    return (
      <div style={{display: 'inline-block'}}>
        <RaisedButton
          backgroundColor={colors.red200}
          icon={<FontIcon className="material-icons">format_paint</FontIcon>}
          onClick={this.openColorPicker.bind(this)}
        />
      <Popover
        open={this.state.colorPickerOpen}
        anchorEl={this.state.colorPickerButton}
        anchorOrigiin={{horizontal: 'left', vertical: 'bottom'}}
        targetOrigin={{horizontal: 'left', vertical: 'top'}}
        onRequestClose={this.closeColorPicker.bind(this)}
        >
        <CirclePicker onChangeComplete={this.formatColor.bind(this)}/>
      </Popover>
      </div>
    );
  }
  applyIncreaseFontSize(shrink) {
    var newFontSize = this.state.currentFontSize + (shrink ? -4 : 4);
    var newInlineStyles = Object.assign(
      {},
      this.state.inlineStyles,
      {
        [newFontSize]: {
          fontSize: `${newFontSize}px`
        }
      }
    )

    this.setState({
      inlineStyles: newInlineStyles,
      editorState: RichUtils.toggleInlineStyle(this.state.editorState, String(newFontSize)),
      currentFontSize: newFontSize
    })
  }

  increaseFontSize(shrink) {
    return (
      <RaisedButton
        backgroundColor={colors.red200}
        onMouseDown={() => this.applyIncreaseFontSize(shrink)}
        icon={<FontIcon className="material-icons">{shrink ? 'zoom_out' : 'zoom_in'}</FontIcon>}
      />
    )
  }

  toggleInlineFormat(style) {
    this.setState({
      editorState: RichUtils.toggleInlineStyle(this.state.editorState, style)
    })
  }

  formatButton({icon, style}) {
    return (
      <RaisedButton
        secondary={true}
        backgroundColor={
          this.state.editorState.getCurrentInlineStyle().has(style) ?
          colors.red700 :
          colors.red400
        }
        onMouseDown={(e) => this.toggleInlineStyle(e, style)}
        icon={<FontIcon className="material-icons">{icon}</FontIcon>}
      />
    )
  }

  render() {
    return(
      <div>
        <AppBar title="Document Editor"/>
        <div className="editor">
          <div className="toolbar">

            {this.formatButton({icon: 'format_bold', style: 'BOLD' })}
            <button onMouseDown={(e) => this.toggleInlineStyle(e, 'ITALIC')}>I</button>
            <button onMouseDown={(e) => this.toggleInlineStyle(e, 'UNDERLINE')}>U</button>
            <button onMouseDown={(e) => this.toggleInlineStyle(e, 'STRIKETHROUGH')}>S</button>
            <button onMouseDown={(e) => this.toggleInlineStyle(e, 'UPPERCASE')}>ABC</button>
            <button onMouseDown={(e) => this.toggleInlineStyle(e, 'LOWERCASE')}>xyz</button>

            <button onMouseDown={(e) => this.toggleBlockType(e, 'unordered-list-item')}>Unordered List</button>
            <button onMouseDown={(e) => this.toggleBlockType(e, 'ordered-list-item')}>Ordered List</button>
            <button onMouseDown={(e) => this.alignRight(e)}>Align Right</button>
            <button onMouseDown={(e) => this.alignLeft(e)}>Align Left</button>
            <button onMouseDown={(e) => this.alignCenter(e)}>Center</button>
            {this.colorPicker()}
            {this.increaseFontSize(false)}
            {this.increaseFontSize(true)}

              {/* <div style={{display: 'flex', padding: '15px'}}>
                <div style={{ flex: '1 0 25%' }}>
                  <ColorPicker
                    toggleColor={color => this.picker.addColor(color)}
                    presetColors={presetColors}
                    color={this.picker.currentColor(this.state.editorState)}/>
                    <button onClick={this.picker.removeColor}>clear</button>
                  </div>
                </div> */}

            </div>
              <Editor
                // customStyleFn={this.picker.customStyleFn}
                editorState={this.state.editorState}
                onChange={this.onChange}
                customStyleMap={this.state.inlineStyles}
                blockStyleFn={this.myBlockStyleFn}
              />
      {[8,10,12,14,16,18,20,24].map(size => <button key={size} onClick={this.onSetStyle('fontSize', size)}>{size}</button>)}
           <button onClick={this.mark}>mark</button>

            </div>
            <button onClick={() => this.props.redirect("Home")}>Home James</button>
          </div>
        )
      }
    }
