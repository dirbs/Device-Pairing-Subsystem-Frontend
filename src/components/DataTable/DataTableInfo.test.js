import React from 'react';
import {shallow, mount} from 'enzyme';
import DataTableInfo from './DataTableInfo';

const pageInfo = {
  start: 1,
  limit: 10,
  total: 50,
  itemType: 'requests'
}

describe('DataTableInfo', () => {

  /* Test if render correctly */
  test('should render correctly', () => {
    const wrapper = shallow(<DataTableInfo />);
    expect(wrapper).toMatchSnapshot();
  });

  /* Test if DataTableInfo renders successfully */
  test('should render DataTableInfo successfully', () => {
    const wrapper = shallow(<DataTableInfo />);
    expect(wrapper.exists()).toBe(true);
  });

  /* Test DataTableInfo have certain props */
  test('DataTableInfo have certain props', () => {
    const wrapper = mount(<DataTableInfo start={pageInfo.start} limit={pageInfo.limit} total={pageInfo.total} itemType={pageInfo.itemType} />);
    expect(wrapper.find('DataTableInfo').props().start).toBe(1);
    expect(wrapper.find('DataTableInfo').props().limit).toBe(10);
    expect(wrapper.find('DataTableInfo').props().total).toEqual(50);
    expect(wrapper.find('DataTableInfo').props().itemType).toEqual('requests');
  });

  /* Test DataTableInfo wrapper has specific class */
  test('DataTableInfo wrapper has specific class and spans', () => {
    const wrapper = mount(<DataTableInfo start={pageInfo.start} limit={pageInfo.limit} total={pageInfo.total} itemType={pageInfo.itemType} />);
    expect(wrapper.find('p').hasClass('page-result')).toBe(true);
    expect(wrapper.find('p').find('span')).toHaveLength(2);
  });

  /* Test total should be used if pagination reaches to end */
  test('total requests count if pagination reaches to end', () => {
    const pageInfo = {
      start: 41,
      limit: 10,
      total: 47,
      itemType: 'requests'
    }
    const wrapper = mount(<DataTableInfo start={pageInfo.start} limit={pageInfo.limit} total={pageInfo.total} itemType={pageInfo.itemType} />);
    expect(wrapper.find('span').at(1).text()).toBe((pageInfo.total).toString());
  });

  /* Test requests limit should be test */
  test('request limit should be used', () => {
    const pageInfo = {
      start: 0,
      limit: 10,
      total: 47,
      itemType: 'requests'
    }
    const wrapper = mount(<DataTableInfo start={pageInfo.start} limit={pageInfo.limit} total={pageInfo.total} itemType={pageInfo.itemType} />);
    expect(wrapper.find('span').at(0).text()).toBe((pageInfo.start + 1) + ' to ' + (pageInfo.limit).toString());
  });

});