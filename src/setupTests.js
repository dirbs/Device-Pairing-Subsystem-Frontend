import React from 'react'
import sinon from 'sinon'
import Enzyme, { shallow, mount, render} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
require('jest-localstorage-mock');

Enzyme.configure({ adapter: new Adapter() });
const mockKcProps = {
  'isTokenExpired' : sinon.spy()
}

global.React = React;
global.Sinon = sinon;
global.shallow = shallow;
global.mount = mount;
global.render = render;
global.mockKcProps = mockKcProps;