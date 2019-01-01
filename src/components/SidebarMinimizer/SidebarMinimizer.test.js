import React from 'react';
import {shallow} from 'enzyme';
import SidebarMinimizer from './SidebarMinimizer';

describe('Sidebar minimizer component', () => {

  /* Test if SidebarMinimizer renders successfully */
  test('Side bar minimizer button renders successfully', () => {
    const wrapper = shallow(<SidebarMinimizer />);
    expect(wrapper.exists()).toBe(true);
  });

  /* Test if SidebarMinimizer click function works */
  test('Should toggle the class sidebar-minimized when clicking on side bar minimizer button', () => {
    const wrapper = shallow(<SidebarMinimizer />);
    const sidebarMinimize = spyOn(SidebarMinimizer.prototype, 'sidebarMinimize');
    wrapper.find('button').simulate('click');
    expect(sidebarMinimize).toHaveBeenCalled();
  });

  /* Test if brandMinimize click function works */
  test('Should toggle the class brand-minimized when clicking on side bar minimizer button', () => {
    const wrapper = shallow(<SidebarMinimizer />);
    const brandMinimize = spyOn(SidebarMinimizer.prototype, 'brandMinimize');
    wrapper.find('button').simulate('click');
    expect(brandMinimize).toHaveBeenCalled();
  });

})