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
          ry: yValueInInterval(y - uncertainty, y + uncertainty),
          y,
          y1: y + uncertainty,
          y0: y - uncertainty,
        };
      }

      const y1 = prev.ry + uncertainty;
      const y0 = prev.ry - uncertainty;
      const y = (y0 + y1) / 2;
      const ry = yValueInInterval(y0, y1);

      return {
        ry,
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
          ry: yValueInInterval(y - uncertainty, y + uncertainty),
          y,
          y1: y + uncertainty,
          y0: y - uncertainty,
        };
      }

      const y1 = prev.ry + (1.5 * uncertainty);
      const y0 = prev.ry - (0.5 * uncertainty);
      const y = (y0 + y1) / 2;
      const ry = yValueInInterval(y0, y1);

      return {
        ry,
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
          ry: yValueInInterval(y - uncertainty, y + uncertainty),
          y,
          y1: y + uncertainty,
          y0: y - uncertainty,
        };
      }

      const t = 4 * (data.length / n);

      const genFn = s => (prev.y + (Math.log(3) * Math.pow(3, s)));

      const y1 = genFn(t) + uncertainty;
      const y0 = genFn(t) - uncertainty;
      const y = (y0 + y1) / 2;
      const ry = yValueInInterval(y0, y1);

      return {
        ry,
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

  static randomModel(domain, startRange = [100, 500], uncertainty = 20) {
    const models = [FAData.exponential, FAData.randomWalk, FAData.increase];
    const randomModelIndex = Math.floor(Math.random() * models.length);

    return models[randomModelIndex](domain, startRange, uncertainty);
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
        const seriesKeyStartRange = seriesKeyObj.startRange;
        const seriesKeyUncertainty = seriesKeyObj.uncertainty;
        const seriesValues = requestParams[seriesKeyName];

        return map(
          FAData[seriesKeyModel](seriesValues, seriesKeyStartRange, seriesKeyUncertainty),
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
