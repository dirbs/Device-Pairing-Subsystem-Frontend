import React from 'react';
import {shallow, mount, render} from 'enzyme';
import RenderArrayError from './RenderArrayError';

describe('RenderArrayError component', () => {

  /* Test RenderArrayError render */
  test('RenderArrayError render successfully', () => {
    const wrapper = shallow(<RenderArrayError errors={true} />);
    expect(wrapper.exists()).toBe(true);
  });

})