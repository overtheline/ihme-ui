import React from 'react';
import { render } from 'react-dom';
import { maxBy, minBy } from 'lodash';

import AxisChart from '../../axis-chart';
import { MultiLine } from '../../shape';
import { XAxis, YAxis } from '../../axis';
import Button from '../../button';

const width = 600;
const height = 300;
const padding = { top: 20, bottom: 40, left: 55, right: 20 };
const yDomain = [0, 100];
const xDomain = [10, 50];
const dataAccessors = {
  x: 'x',
  y: 'y',
  y0: 'y0',
  y1: 'y1',
};
const areaStyle = {
  fillOpacity: 0.5,
};

function generateData(n, domain, startRange, uncertainty) {
  if (n < 2) {
    console.error('needs more than one point');
    return [];
  }

  const data = [];
  const step = (domain[1] - domain[0]) / (n - 1);

  function getNextY() {
    const prev = data.length ? data[data.length - 1] : null;

    if (!prev) {
      const y = (Math.random() * (startRange[1] - startRange[0])) + startRange[0];
      return {
        y,
        y1: y + uncertainty,
        y0: y - uncertainty,
      };
    }

    const y1 = prev.y + uncertainty;
    const y0 = prev.y - uncertainty;
    const y = (Math.random() * (y1 - y0)) + y0;

    return {
      y,
      y1,
      y0,
    };

  }

  for (let i = 0; i < n; i++) {
    const nextData = getNextY();
    data.push({
      x:domain[0] + (step * i),
      ...nextData,
    });
  }

  return data;
}

class App extends React.Component {
  constructor(props) {
    super(props);

    this.dataIndex = 0;
    this.dataLength = 3;

    this.onClick = this.onClick.bind(this);
  }

  componentWillMount() {
    const dataA = generateData(20, xDomain, yDomain, 10);
    const dataB = generateData(20, xDomain, yDomain, 10);
    const dataC = generateData(20, xDomain, yDomain, 10);
    const range = [minBy(dataA, 'y0').y0, maxBy(dataA, 'y1').y1];
    this.setState({
      dataStore: [
        {
          values: dataA,
          key: 'A',
        },
        {
          values: dataB,
          key: 'B',
        },
        {
          values: dataC,
          key: 'C',
        },
      ],
      data: [{
        values: dataA,
        key: 'A',
      }],
      range,
    });
  }

  onClick() {
    this.dataIndex += 1;
    const nextData = this.state.dataStore[this.dataIndex % this.dataLength];
    const range = [minBy(nextData.values, 'y0').y0, maxBy(nextData.values, 'y1').y1];
    this.setState({
      data: [nextData],
      range,
    });
  }

  render() {
    return (
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <div>
          <Button
            text="Change data"
            onClick={this.onClick}
          />
        </div>
        {/* <pre><code>
         </code></pre> */}
        <AxisChart
          width={width}
          height={height}
          padding={padding}
          xDomain={xDomain}
          yDomain={this.state.range}
        >
          <MultiLine
            areaStyle={areaStyle}
            data={this.state.data}
            dataAccessors={dataAccessors}
          />
          <XAxis label="X-Axis" />
          <YAxis label="Y-Axis" />
        </AxisChart>
      </div>
    );
  }
}

render(<App />, document.getElementById('app'));
