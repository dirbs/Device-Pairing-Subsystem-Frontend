import React from 'react';
import {shallow, mount} from 'enzyme';
import Footer from './Footer';

describe('Footer component', () => {

	/* Test if render correctly */
	test('should render correctly', () => {
		const wrapper = shallow(<Footer />);
		expect(wrapper).toMatchSnapshot();
	});

	/* Test if footer renders successfully */
	test('Footer renders successfully', () => {
		const wrapper = shallow(<Footer />);
		expect(wrapper.exists()).toBe(true);
	})

	/* Test if footer consists of class app-footer */
	test('Footer has class app-footer', () => {
		const wrapper = shallow(<Footer />);
		expect(wrapper.find('.app-footer').length).toEqual(1);
	})

	/* Test footer child div length */
	test('Footer contains child div of length 2', () => {
		const wrapper = mount(<Footer />);
		expect(wrapper.find('div').length).toEqual(2);
	})

})