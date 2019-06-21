import React from 'react';
import {shallow} from 'enzyme';
import RequestStatus from './RequestStatus';

const statusDetails = {
  id: '123',
  icon: 'fa fa-check',
  action: 'Registered',
  showButton: false,
  link: null
}

const  location = {
  pathname: '/request-status',
  state: {details: statusDetails}
}

const historyMock = { push: jest.fn() };

describe('RequestStatus component', () => {

  /* Test if renders correctly */
  test('RequestStatus renders successfully', () => {
    const wrapper = shallow(<RequestStatus location={location} />);
    expect(wrapper.exists()).toBe(true);
  });

  /* Test RequestStatus renders again */
  test('if renders again correctly', () => {
      const wrapper = shallow(<RequestStatus location={location} history={historyMock} />);
      expect(wrapper).toMatchSnapshot();
  });

  /* Test Check class, count html element, text inside DOM */
  test('Check class, count html element, text inside DOM', () => {
      const wrapper = shallow(<RequestStatus location={location} history={historyMock} />);
      //console.log(wrapper.debug());
      expect(wrapper.find('.submitted').length).toEqual(1);
      expect(wrapper.contains(<i className='fa fa-check'></i>)).toBe(true);
      expect(wrapper.find('h4').find('span').text()).toBe('Registered');
      expect(wrapper.find('.msg').find('span').text()).toBe('123');
  });

  /* Test Show button link view request */
  test('View request button link render', () => {
      const  location = {
        pathname: '/request-status',
        state: {
          details: {
            id: '123',
            icon: 'fa fa-check',
            action: 'Registered',
            showButton: true,
            link: '/'
          }
        }
      }
      const wrapper = shallow(<RequestStatus location={location} history={historyMock} />);
      expect(wrapper.find('.link-box').length).toEqual(1);
      expect(wrapper.find('Link')).toHaveLength(1);
  });

})