import React from 'react';
import { mount } from 'enzyme';
import Curve from 'react-leaflet-curve/src/Curve';

import Map from '../Map';

jest.mock('leaflet');
jest.mock('react-leaflet-curve/src/Curve', () => jest.fn(() => null));

describe('map component', () => {
  describe('great circle computation', () => {
    it('draws a curve with the right commands', () => {
      const wrapper = mount(<Map source={[0, 0]} dest={[0, 10]} />);

      expect(wrapper.find(Curve).prop('positions')).toMatchInlineSnapshot(`
        Array [
          "M",
          Array [
            0,
            0,
          ],
          "Q",
          Array [
            0,
            4.999999999999999,
          ],
          Array [
            0,
            10,
          ],
        ]
      `);
    });
  });
});
