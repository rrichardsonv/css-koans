import React from 'react';
import PropTypes from 'prop-types';

const persistEventBefore = handler => (event, ...args) => {
  event.persist();
  return handler(event, ...args);
};

class Resizable extends React.Component {
  static propTypes = {
    children: PropTypes.func.isRequired,
  };

  state = {
    resized: {},
    currentlyResizing: null,
  };

  leaveTimeoutId = null; // eslint-disable-line

  componentWillUnmount() {
    this.clearTimeout();
  }

  clearTimeout = () => {
    if (this.leaveTimeoutId !== null) {
      clearTimeout(this.leaveTimeoutId);
      this.leaveTimeoutId = null;
    }
  };

  getPageX = ({ type, changedTouches, pageX }) => {
    const eventType = type.slice(0, 5);
    if (eventType === 'touch') {
      return changedTouches[0].pageX;
    } else if (eventType === 'mouse') {
      return pageX;
    }
  };

  resizeColumnStart = (event, { accessor }) => {
    const pageX = this.getPageX(event);
    this.clearTimeout();

    const isCollision = event.nativeEvent.offsetX < event.target.getBoundingClientRect().width * 0.8;
  
    if (isCollision) {
      return;
    }

    const startWidth = this.state.resized[accessor] || event.nativeEvent.offsetX;

    this.setState({
      currentlyResizing: {
        accessor,
        startX: pageX,
        startWidth,
      },
      resized: {
        ...this.state.resized,
        [accessor]: startWidth + 2,
      },
    });
  };

  updateResizedColumn = pageX => (prevState) => {
    const { currentlyResizing, resized: previousResized } = prevState;
    if (currentlyResizing === null) {
      return {};
    }
    const { startX, startWidth, accessor } = currentlyResizing;
    const newWidth = startWidth + (pageX - startX);

    const resized = {
      ...previousResized,
      [accessor]: newWidth,
    };

    return { resized };
  };

  resizeColumnMoving = (event) => {
    const pageX = this.getPageX(event);
    const { currentlyResizing } = this.state;

    if (currentlyResizing === null) {
      return;
    }
    this.clearTimeout();
    this.setState(this.updateResizedColumn(pageX));
  };

  resizeColumnEnd = () => {
    console.log(this.state);
    this.clearTimeout();
    this.setState({ currentlyResizing: null });
  };

  resizeColumnLeave = () => {
    this.leaveTimeoutId = setTimeout(this.resizeColumnEnd, 500);
  };

  resetResize = () => {
    this.clearTimeout();
    this.setState({
      resized: {},
      currentlyResizing: null,
    });
  };

  render() {
    return this.props.children({
      handleResizeStart: persistEventBefore(this.resizeColumnStart),
      handleResizeMoving: persistEventBefore(this.resizeColumnMoving),
      handleResizeEnd: this.resizeColumnEnd,
      handleResizeLeave: this.resizeColumnLeave,
      handleResetResize: this.resetResize,
      currentlyResizing: this.state.currentlyResizing,
      resizedColumns: this.state.resized,
    });
  }
}

export default Resizable;