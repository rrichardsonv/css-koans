import React, { Component } from 'react';
import Editor from './Editor';
import Frame from './Frame';

require('codemirror/lib/codemirror.css');

const reverseNormalize = (str) => {
  return str.split('').reverse().join('');
}

class App extends Component {
  state = {
    html: '// Write your html here',
    css: '// Write your css here',
  };

  updateCode = (key) => (newCode) => {
    this.setState({ [key]: newCode });
  }
  updateCss = this.updateCode('css');
  updateHtml = this.updateCode('html');
  render() {
    return (
      <div style={{ width: '100vw'}}className="App">
        <div style={{display: 'flex', flexDirection: 'row'}}>
          <div style={{display: 'flex', flexDirection: 'column'}}>
            <div style={{ width: '300px' }}>
              <Editor
                lineNumbers
                value={this.state.css}
                updateCode={this.updateCss}
              />
            </div>
            <div style={{ width: '300px' }}>
              <Editor
                lineNumbers
                value={this.state.html}
                updateCode={this.updateHtml}
              />
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <Frame />
          </div>
        </div>
      </div>
    );
  }
}

export default App;
