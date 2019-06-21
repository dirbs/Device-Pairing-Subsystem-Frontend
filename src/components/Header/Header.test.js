import React from 'react';
import {shallow, mount} from 'enzyme';
import Header from "./Header";

const userDetails = {
  preferred_username: "User"
}

describe('Header component',() => {

  /* Test if render successfully */
  test('Render Header correctly', () => {
    const wrapper = shallow(<Header />);
    expect(wrapper).toMatchSnapshot();
  });

  /* Test if header renders again */
  test('Renders Header again',() => {
    const wrapper = shallow(<Header />);
    expect(wrapper.exists()).toBe(true);
  });

  /* Test if header consists of class */
  test('If header has class',() => {
    const wrapper = shallow(<Header />);
    expect(wrapper.find('.app-header').length).toEqual(1)
    expect(wrapper.find('.navbar').length).toEqual(1)
  });

  /* Test NavbarBrand render */
  test('NavbarBrand should have contains navbar-brand-minimized and navbar-brand-full',() => {
    const wrapper = shallow(<Header />);
    expect(wrapper.contains(<h5 className="navbar-brand-minimized">DPS</h5>)).toBe(true);
    expect(wrapper.contains(<h5 className="navbar-brand-full">Device Pairing Subsystem</h5>)).toBe(true);
  });

  /* Test if header consists of toggler */
  test('If header has navbar-toggler-icon',() => {
    const wrapper = shallow(<Header />);
    expect(wrapper.contains(<span className="navbar-toggler-icon"></span>)).toBe(true);
  });

  /* Test mobile sidebar button click */
  test('Mobile sidebar button click works', () => {
    const wrapper = shallow(<Header />);
    // mobile sidebar toggler button click
    wrapper.find('NavbarToggler').at(0).simulate('click',{
      preventDefault: () => {
      }
    });
    expect(document.body.classList.contains('sidebar-mobile-show'));

  });

  /* Test toggle sidebar button click */
  test('should toggle sidebar button', () => {
    const wrapper = shallow(<Header />);
    wrapper.find('NavbarToggler').at(1).simulate('click', {
        preventDefault: () => {
      }
    });
    expect(document.body.classList.contains('sidebar-hidden'))
  });


})