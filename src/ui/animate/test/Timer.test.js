import { expect } from 'chai';

import Timer from '../src/utils/Timer';

describe('Timer', () => {
  let timer = new Timer();
  let subscribingObj = {
    callbackCount: 0,
    timerCallback: (t) => {
      this.callbackCount++;

      return t;
    },
  };

  it('calls the subscriber callback and provides the subscriber an id', () => {
    subscribingObj.id = timer.subscribe(subscribingObj.timerCallback);

    setTimeout(() => {
      expect(subscribingObj.callbackCount).to.be.above(0);
      expect(subscribingObj.id).to.be.a('string');
    }, 100);
  });

  timer.stop();
});
