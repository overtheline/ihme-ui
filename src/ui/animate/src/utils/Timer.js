import { timer, now } from 'd3-timer';
import { forEach, remove } from 'lodash';

export default class Timer {
  constructor() {
    this.subscribers = [];
    this.loop = this.loop.bind(this);
    this.timer = timer(this.loop);
  }

  getTimer() {
    return this.timer;
  }

  loop() {
    forEach(
      this.subscribers,
      (subscriber) => {
        subscriber.callback(now() - subscriber.startTime, subscriber.duration);
      }
    );
  }

  subscribe(callback, duration) {
    const startTime = now();
    const id = `${startTime}:${this.subscribers.length}`;

    this.subscribers.push({
      startTime,
      id,
      callback,
      duration,
    });

    // returns id for subscribing object to store
    // id is required to unsubscribe
    return id;
  }

  unsubscribe(id) {
    if (id !== null) {
      remove(
        this.subscribers,
        (subscriber) => subscriber.id === id
      );
    }
  }

  unsubscribeAll() {
    if (this.subscribers.length) {
      this.subscribers = [];
    }
  }

  start() {
    this.timer.start();
  }

  stop() {
    this.timer.stop();
  }
}
