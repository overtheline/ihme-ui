import React, { PropTypes } from 'react';
import {
  CommonPropTypes,
  CommonDefaultProps,
} from '../../../utils';

class AnimatePath extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      dt: 'interpolated path string',
    };
  }

  render() {
    const {
      className,
      clipPath,
      d,
      onClick,
      onMouseLeave,
      onMouseMove,
      onMouseOver,
      style,
    } = this.props;

    return (
      <path
        className={className}
        clipPath={clipPath}
        d={d}
        onClick={onClick}
        onMouseLeave={onMouseLeave}
        onMouseMove={onMouseMove}
        onMouseOver={onMouseOver}
        style={style}
      />
    );
  }
}

AnimatePath.propTypes = {
  /**
   * className applied to path.
   */
  className: CommonPropTypes.className,

  /**
   * if a clip path is applied to a container element (e.g., an `<AxisChart />`),
   * clip this path to that container by passing in the clip path URL id.
   */
  clipPath: PropTypes.string,

  d: PropTypes.string,

  /**
   * onClick callback.
   * signature: (SyntheticEvent, data, instance) => {...}
   */
  onClick: PropTypes.func,

  /**
   * onMouseLeave callback.
   * signature: (SyntheticEvent, data, instance) => {...}
   */
  onMouseLeave: PropTypes.func,

  /**
   * onMouseMove callback.
   * signature: (SyntheticEvent, data, instance) => {...}
   */
  onMouseMove: PropTypes.func,

  /**
   * onMouseOver callback.
   * signature: (SyntheticEvent, data, instance) => {...}
   */
  onMouseOver: PropTypes.func,

  /**
   * inline styles applied to path
   */
  style: CommonPropTypes.style,
};

AnimatePath.defaultProps = {
  onClick: CommonDefaultProps.noop,
  onMouseLeave: CommonDefaultProps.noop,
  onMouseMove: CommonDefaultProps.noop,
  onMouseOver: CommonDefaultProps.noop,
  style: {
    fill: 'steelblue',
    stroke: 'steelblue',
    strokeWidth: 1,
  },
};

export default AnimatePath;
