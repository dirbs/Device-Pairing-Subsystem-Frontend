import React from 'react';
import {shallow, mount} from 'enzyme';
import Sidebar from './Sidebar';
import { I18nextProvider } from 'react-i18next';
import i18n from './../../i18nTest';

describe('Sidebar component', () => {

  /* Test if Sidebar renders successfully */
  test('If Sidebar renders successfully', () => {
    const wrapper = shallow(<Sidebar />);
    expect(wrapper.exists()).toBe(true);
  });

  /* Test nav item consists of length */
  test('If nav item consists of length', () => {
    const wrapper = mount(
      <I18nextProvider i18n={i18n}>
        <Sidebar />
      </I18nextProvider>
      );
    //console.log(wrapper.debug());
    expect(wrapper.find('NavItem').exists()).toBe(true);
  });

  /* Test sidebar classes and html element */
  test('should have sidebar, sidebar-nav classes and ul listing', () => {
    const wrapper = mount(
      <I18nextProvider i18n={i18n}>
        <Sidebar />
      </I18nextProvider>
    );
    expect(wrapper.find('.sidebar').length).toEqual(1);
    expect(wrapper.find('.sidebar-nav').length).toEqual(1);
    expect(wrapper.find('ul').hasClass('nav')).toBe(true);
    expect(wrapper.find('ul li').find('.nav-title').length).toEqual(1);
  });

})