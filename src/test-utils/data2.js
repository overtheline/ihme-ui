import {
  assign,
  concat,
  every,
  flatMap,
  has,
  isArray,
  map,
  reduce,
} from 'lodash';

function yValueInInterval(y0, y1) {
  return (((4 * Math.pow(Math.random() - 0.5, 3)) + 0.5) * (y1 - y0)) + y0;
}

export default class FAData {
  constructor(config) {
    this.config = config;

    this.primaryKeyFields = config.primaryKeyFields;
    this.seriesKeyFields = config.seriesKeyFields;
    this.dataKeyField = config.dataKeyField;
  }

  static randomWalk(domain, startRange = [100, 500], uncertainty = 20) {
    const n = domain.length;

    if (n < 1) {
      console.error('needs at least one point');
      return [];
    }

    const data = [];

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
      const y = yValueInInterval(y0, y1);

      return {
        y,
        y1,
        y0,
      };
    }

    for (let i = 0; i < n; i += 1) {
      const nextData = getNextY();
      data.push({
        x: domain[i],
        ...nextData,
      });
    }

    return data;
  }

  static increase(domain, startRange = [100, 500], uncertainty = 20) {
    const n = domain.length;

    if (n < 1) {
      console.error('needs at least one point');
      return [];
    }

    const data = [];

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

      const y1 = prev.y + (1.5 * uncertainty);
      const y0 = prev.y - (0.5 * uncertainty);
      const y = yValueInInterval(y0, y1);

      return {
        y,
        y1,
        y0,
      };
    }

    for (let i = 0; i < n; i += 1) {
      const nextData = getNextY();
      data.push({
        x: domain[i],
        ...nextData,
      });
    }

    return data;
  }

  static exponential(domain, startRange = [100, 500], uncertainty = 20) {
    const n = domain.length;

    if (n < 2) {
      console.error('needs more than one point');
      return [];
    }

    const data = [];

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

      const t = data.length / n;

      const genFn = s => (prev.y * Math.pow(2, s / 10));

      const y1 = genFn(t) + uncertainty;
      const y0 = genFn(t) - uncertainty;
      const y = yValueInInterval(y0, y1);

      return {
        y,
        y1,
        y0,
      };
    }

    for (let i = 0; i < n; i += 1) {
      const nextData = getNextY();
      data.push({
        x: domain[i],
        ...nextData,
      });
    }

    return data;
  }

  getData(requestParams) {
    const seriesKeyFields = this.seriesKeyFields;
    const dataKeyField = this.dataKeyField;

    function getPrimaryKeyData(acc, primaryKey) {
      const primaryKeyName = primaryKey;
      const primaryValue = requestParams[primaryKeyName];

      if (isArray(primaryValue)) {
        const nextData = flatMap(
          primaryValue,
          val => map(acc.slice(), datum => assign({ [primaryKeyName]: val }, datum))
        );

        if (!every(acc, datum => has(datum, primaryKeyName))) {
          return nextData;
        }

        return concat(acc, nextData);
      }

      if (!acc.length) return [{ [primaryKeyName]: primaryValue }];

      return map(acc, datum => assign(datum, { [primaryKeyName]: primaryValue }));
    }

    function getSeriesData(primaryDataObj) {
      function mapSeriesKeys(seriesKeyObj) {
        const seriesKeyName = seriesKeyObj.key;
        const seriesKeyModel = seriesKeyObj.model;
        const seriesValues = requestParams[seriesKeyName];

        return map(
          FAData[seriesKeyModel](seriesValues),
          datum => ({
            [dataKeyField.key]: datum.y,
            [dataKeyField.uncertainty[0]]: datum.y0,
            [dataKeyField.uncertainty[1]]: datum.y1,
            [seriesKeyName]: datum.x,
            ...primaryDataObj,
          })
        );
      }

      return flatMap(seriesKeyFields, mapSeriesKeys);
    }

    const primaryKeyData = reduce(this.primaryKeyFields, getPrimaryKeyData, []);

    return flatMap(primaryKeyData, getSeriesData);
  }
}
