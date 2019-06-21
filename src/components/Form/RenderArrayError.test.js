import React from 'react';
import {shallow, mount, render} from 'enzyme';
import RenderArrayError from './RenderArrayError';

describe('RenderArrayError component', () => {

  /* Test RenderArrayError render */
  test('RenderArrayError render successfully', () => {
    const wrapper = shallow(<RenderArrayError errors={true} />);
    expect(wrapper.exists()).toBe(true);
  });

  /* Test RenderArrayError render */
  //test('RenderArrayError render successfully', () => {
    //const wrapper = mount(<RenderArrayError errors={true} />);
    //console.log(wrapper.debug());
    //expect(wrapper.contains(<span className="invalid-feedback p-0" style={{display: 'block'}}>{errors[mainIndex].imeis[innerIndex][field]}</span>)).toBe(true);
  //});

})