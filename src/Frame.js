import React from 'react';

const Style = ({css}) => (
  <style>
    {`${css}`}
  </style>
);

const Html = ({html}) => (
  <div dangerouslySetInnerHTML={{__html: html}} />
);

const Frame = ({ css, html }) => (
  <div style={{ border: '2px dotted hotpink', width: '100%', height: '100%'}}>
    <Style css={css}/>
    <Html html={html}/>
  </div>
);

export default Frame;
