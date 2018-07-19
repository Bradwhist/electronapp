import React from 'react';
import {Editor, EditorState, RichUtils, contentState, convertToRaw, convertFromRaw} from 'draft-js';
import RaisedButton from 'material-ui/RaisedButton';
// import ColorPicker, { colorPickerPlugin } from 'draft-js-color-picker';
// import createStyles from 'draft-js-custom-styles'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppBar from 'material-ui/AppBar';
import { CirclePicker } from 'react-color';
import Popover from 'material-ui/Popover';
import * as colors from 'material-ui/styles/colors'
import FontIcon from 'material-ui/FontIcon';
import ColorPicker, { colorPickerPlugin } from 'draft-js-color-picker';
import io from 'socket.io-client';
import axios from 'axios';
import Modal from 'react-modal';

const customStyleMap = {
  remoteCursor: {
    borderLeft: 'solid 3px red'
  }
}


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
  },
  remoteCursor: {
    borderLeft: 'solid 3px red'
  }
}

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

// const {
//   styles,
//   customStyleFn,
// } = createStyles(['font-size', 'color'], customStyleMap)
//Modal.setAppElement('root');

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
    },
    socket: io('http://localhost:8080'),
    connecting: true,
    currentDoc: this.props.currentDoc,
    collaborators: this.props.collaborators,
    modalIsOpen: false,
    users: [],
      // socket: io('http://localhost:8080'),
    }

    this.getEditorState = () => this.state.editorState;

     this.picker = colorPickerPlugin(this.onChange, this.getEditorState)
     this.openModal = this.openModal.bind(this);
     this.afterOpenModal = this.afterOpenModal.bind(this);
     this.closeModal = this.closeModal.bind(this);

  }

  //load all users
  updateUsers = () => {
  axios({
    method: 'get',
    url: 'http://localhost:3000/auth/user',

  })
  .then(response => {
    this.setState({users: response.data})
  })
  .catch(err => console.log(err))

}


  ///////////////////////////////////////////////////////////////////
   //Modal Helper Functions
  /////////////////////////////////////////////////////////////////

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

addCollab = (user) => {
  axios({
    method: 'post',
    url: 'http://localhost:3000/auth/collaborator',
    data: {
      user: user,
      doc: this.state.currentDoc,
    }
  })
.then(response => {
  console.log(response);
})
.catch(err => console.log(err))

}
////////////////////////////
//End Modal Helper Functions
////////////////////////////

  update = (data) => {
    this.setState({editorState:EditorState.createWithContent(convertFromRaw(data))})
  }

  onChange = (editorState) => {
    this.setState({editorState});

    this.state.socket.emit('edit', {content: convertToRaw(editorState.getCurrentContent()), docId: this.state.currentDoc});
  };

  componentDidMount () {
    //load users into Strate
    this.updateUsers();
   console.log(this.state.editorState);
    //var update = (data) => {this.setState({editorState: EditorState.createWithContent(convertFromRaw(data))})}
    var socket = this.state.socket;
    var currentDoc = this.state.currentDoc;
    // this.state.socket.on('connect', () => this.setState({connecting: null}));
    // this.state.socket.on('disconnect', () => this.setState({connecting: false}));
    // this.state.socket.on('msg', function(data){
    //   console.log('ws msg:', data);
    //   });
    var currentContent = null;
    var _this = this;
    axios({
      method: 'get',
      url: 'http://localhost:3000/auth/doc/' + this.state.currentDoc,
    })
    .then(response => {
      console.log(response.data.content);
      _this.update(JSON.parse(response.data.content));
    })
    .catch(err => console.log(err))


    socket.on('connect', function() {
      socket.emit('room', currentDoc);
    });
    socket.on('update', function(data) {
      _this.update(data);
    })

  }

//   componentWillUnmount() {
//
//   // clean up our listeners
//   this.state.socket.off('syncDocument', this.remoteStateChange)
//   this.state.socket.emit('closeDocument', {docId: options.docId}, (res) => {
//     if(res.err) return alert('Opps Error')
//     this.setState({ docs: res.docs })
//   })
// }

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
    console.log('this.state.users', this.state.users);
    console.log('this.state.collaborators', this.state.collaborators);
    return(
      <div id="root">
        <AppBar title="Document Editor"/>
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
            {this.colorPicker()}
            {this.increaseFontSize(false)}
            {this.increaseFontSize(true)}
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
      <button onClick={this.openModal}>Add Collaborators</button>
        <Modal
          isOpen={this.state.modalIsOpen}
          onAfterOpen={this.afterOpenModal}
          onRequestClose={this.closeModal}
          style={modalStyles}
          contentLabel="Example Modal"
          >

          <h2 ref={subtitle => this.subtitle = subtitle}>Add Conspirators</h2>
          <button onClick={this.closeModal}>close</button>
          <div>Plot Shenanigans</div>
            <h4>Potential Plotters</h4>
            <ul>

            {this.state.users.filter((user) => { return this.state.collaborators.indexOf(user._id) === -1}).map(user => (
              <li>
                <p>{user.user}</p>
                <button onClick={() => this.addCollab(user._id)}>Add Comrade</button>
              </li>
            ))}
            </ul>
            <form>
              <input />
              <button>tab navigation</button>
              <button>stays</button>
              <button>inside</button>
              <button>the modal</button>
            </form>
          </Modal>

          <button onClick={() => this.props.redirect("Home")}>Home James</button>
    </div>
        )
      }
    }
    //.filter(user => {this.state.collaborators.indexOf(user._id) === -1})
    // componentDidMount() {
    //
    // };
    //
    // componentWillunmount() {
    //   const
    // }
    // socket.on

    //socket.emit('openDocument', {docId})
