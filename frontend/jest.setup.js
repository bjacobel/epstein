import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import * as config from './config';

Enzyme.configure({ adapter: new Adapter() });

window.fetch = jest.fn(() => Promise.resolve({}));
global.projectConfig = config;
