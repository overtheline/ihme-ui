import { expect } from 'chai';
import FAData from '../data2';


const dataConfig = {
  primaryKeyFields: ['pk1', 'pk2', 'pk3', 'location'],
  seriesKeyFields: [
    {
      key: 'year',
      model: 'randomWalk',
    },
  ],
  dataKeyField: {
    key: 'mean',
    uncertainty: ['mean_lb', 'mean_ub'],
  },
};

describe('data generator', () => {
  const dataGenerator = new FAData(dataConfig);

  describe('getData', () => {
    const data = dataGenerator.getData({
      pk1: 123,
      pk2: [345, 12, 8],
      pk3: ['abc', 'def'],
      year: [2000, 2005],
      location: [101, 102],
    });

    it('returns an array of data objects', () => {
      expect(data).to.be.an('array').with.length(24);
      data.forEach(
        datum => expect(datum)
          .to.be.an('object')
          .to.have.all.keys('pk1', 'pk2', 'pk3', 'location', 'year', 'mean', 'mean_ub', 'mean_lb')
      );
    });

    it('returns data with uncertainty intervals', () => {
      data.forEach(
        datum => expect(datum.mean)
          .to.be.within(datum.mean_lb, datum.mean_ub)
      );
    });

    it('returns datum objects that are unique', () => {
      data.forEach((datum1) => {
        data.forEach((datum2) => {
          if (datum1 !== datum2) {
            expect(datum1).to.not.deep.equal(datum2);
          }
        });
      });
    });

    it('generates data for a series of length one', () => {
      const oneDatumPerPrimaryKey = dataGenerator.getData({
        pk1: 123,
        pk2: [345, 12, 8],
        pk3: ['abc', 'def'],
        year: [2000],
        location: [101, 102],
      });

      expect(oneDatumPerPrimaryKey).to.have.length(12);
    });
  });
});
