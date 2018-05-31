import React from 'react';
import CodeMirror from 'react-codemirror';
import Resizable from './Resizable';

const EDITOR_ID = 'editor1';

class Editor extends React.Component {
  state = {
    code: "// Write your code here"
  }
  static resolveWidth(defaultWidth, { resizedColumns }, ...otherObjects){
    const resizeWidth = resizedColumns[EDITOR_ID];
    return Object.assign({}, {
      width: `${resizeWidth || defaultWidth}px`,
    }, resizeWidth && {
        flex: `${resizeWidth} 1 auto`,
        maxWidth: `${resizeWidth}px`,
    }, ...otherObjects)
  }
  updateCode = (newCode) => {
    if(this.props.updateCode){
      this.props.updateCode(newCode);
      return;
    }
    this.setState({ code: newCode });
  }
  render(){
    const { height, width, ...rest } = this.props;
    return (
      <Resizable>
        {(resizableProps) => (
          <div style={Editor.resolveWidth(width, resizableProps, {
              display: 'flex',
              flexDirection: 'row',
              backgroundColor: '#ccc',
            })}
            onMouseDown={(e) => resizableProps.handleResizeStart(e, { accessor: EDITOR_ID })}
            onMouseMove={(e) => resizableProps.handleResizeMoving(e)}
            onMouseUp={(e) => resizableProps.handleResizeEnd(e)}
            onMouseLeave={(e) => resizableProps.handleResizeLeave(e)}
          >
            <div style={{ flex: '1 0 0%', height, width: 'calc(100%-18px)', border: '1px solid black' }}>
              <CodeMirror value={this.props.value || this.state.code} onChange={this.updateCode} options={rest} />
            </div>
            <div
              style={pivotStyles}
            >
              >>
            </div>
          </div>
        )}
      </Resizable>
    );
  }
}

Editor.defaultProps = {
  height: 'auto',
  width: 300,
}

const pivotStyles = { display: 'flex', flexDirection: 'column', justifyContent: 'center', flex: '0 0 0%' };

export default Editor;
