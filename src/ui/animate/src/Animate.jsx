import React, { PropTypes } from 'react';

export default class Animate extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      React.createElement(this.props.children(), this.props)
    );
  }
}

Animate.propTypes = {
  children: PropTypes.func.isRequired,
};
