import React, { PropTypes } from 'react';
import { Animate } from 'react-move';

import AxisChart from '../../axis-chart/src/axis-chart';

const AnimateAxisChart = function animateAxisChart(props) {
  return (
    <Animate
      data={props.animateData}
    >
      <AxisChart
        {...props}
      >
        {props.children}
      </AxisChart>
    </Animate>
  );
};

AnimateAxisChart.propTypes = {
  children: PropTypes.node.isRequired,
  animateData: PropTypes.object,
};

export default AnimateAxisChart;
