import React from 'react';
import {shallow, mount} from 'enzyme';
import HeaderDropdown from "./HeaderDropdown";
import Sinon from 'sinon';

const userDetails = {
  preferred_username: "User"
}

describe('Header dropdown component', () => {

  test('renders HeaderDropdown', () => {
    const mockLogout = Sinon.spy();
    const wrapper = shallow(<HeaderDropdown userDetails={userDetails} kc={{logout: mockLogout}}/>);
    expect(wrapper.exists()).toBe(true);
  });

  test('should toggle the state.dropdownOpen property when clicking on username dropdown button', () => {
      const mockLogout = Sinon.spy();
      const wrapper = mount(<HeaderDropdown kc={{logout: mockLogout}} userDetails={userDetails} />);
      // find button and simulate click
      wrapper.find('button').simulate('click')
      expect(wrapper.state().dropdownOpen).toBe(true);
      // find button and simulate click
      wrapper.find('button').simulate('click')
      expect(wrapper.state().dropdownOpen).toBe(false);
  });

  test('logout button text is Logout if clicked logout button works', () => {
    const mockLogout = Sinon.spy();
    const wrapper = mount(<HeaderDropdown kc={{logout: mockLogout}} userDetails={userDetails} />);
    wrapper.find('button').simulate('click');
    expect(wrapper.find('button').text().trim()).toBe('Logout');
    expect(mockLogout.callCount).toBe(1);
  });

  test('render username correctly', () => {
    const mockLogout = Sinon.spy();
    const wrapper = mount(<HeaderDropdown kc={{logout: mockLogout}} userDetails={userDetails} />);
    //console.log(wrapper.debug());
    expect(wrapper.contains(<span className="mr-3 h6 d-inline-block mt-2">User</span>)).toBe(true);
  });
  
  /* Test if dropdown menu consists of class right */
  test('If dropdown menu consists of class dropdown-menu-right', () => {
    const mockLogout = Sinon.spy();
    const wrapper = mount(<HeaderDropdown kc={{ logout: mockLogout}} />);
    const dropDownMenu = wrapper.find('.dropdown-menu');
    expect(dropDownMenu.find('.dropdown-menu-right').length).toEqual(1);
  });

})