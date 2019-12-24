import { describePassengers } from '../Flight';

describe('Flight page container', () => {
  describe('describePassengers function', () => {
    it('displays correctly when no passengers are canonical', () => {
      expect(
        describePassengers([{ literal: 'A' }, { literal: 'B' }]),
      ).toMatchInlineSnapshot(`"2 passengers were listed on the manifest"`);
    });

    it('displays correctly when one passenger is canonical', () => {
      expect(
        describePassengers([{ literal: 'A' }, { name: 'Mr. B' }]),
      ).toMatchInlineSnapshot(
        `"2 passengers were listed on the manifest, including Mr. B"`,
      );
    });

    it('displays correctly when two passengers are canonical', () => {
      expect(
        describePassengers([
          { literal: 'A' },
          { literal: 'B', name: 'Mr. B' },
          { literal: 'C', name: 'Mrs. C' },
        ]),
      ).toMatchInlineSnapshot(
        `"3 passengers were listed on the manifest, including Mr. B and Mrs. C"`,
      );
    });

    it('displays correctly when three passengers are canonical', () => {
      expect(
        describePassengers([
          { literal: 'A' },
          { literal: 'B', name: 'Mr. B' },
          { literal: 'C', name: 'Mrs. C' },
          { literal: 'D', name: 'Dr. D' },
        ]),
      ).toMatchInlineSnapshot(
        `"4 passengers were listed on the manifest, including Mr. B, Mrs. C and Dr. D"`,
      );
    });
  });
});
