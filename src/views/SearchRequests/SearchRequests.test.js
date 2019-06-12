import React from 'react';
import {shallow, mount} from 'enzyme';
import SearchRequests from './SearchRequests';
import { withFormik, Field } from 'formik';
import { I18nextProvider } from 'react-i18next';
import i18n from './../../i18nTest';
import I18n from "i18next";
import sinon from 'sinon';
import mockAxios from 'jest-mock-axios';
import {BrowserRouter as Router} from 'react-router-dom';

Object.defineProperty(window, 'matchMedia', {
  value: () => ({
    matches: false,
    addListener: () => {
    },
    removeListener: () => {
    }
  })
});

const mockKcProps = {
  'isTokenExpired': sinon.spy()
}

const mockHeader = {
  "headers": {
    "Authorization": "Bearer null",
    "Content-Type": "application/json"
  }
}

afterEach(() => {
  // cleaning up the mess left behind the previous test
  mockAxios.reset();
});

const disabled = true;

describe('SearchRequests component', () => {

  /* Test if render successfully */
  test('If render correctly', () => {
    const wrapper = shallow(<SearchRequests />);
    expect(wrapper).toMatchSnapshot();
  });

  /* Test SearchRequests renders successfully */
  test('SearchRequests renders correctly', () => {
    const wrapper = shallow(<SearchRequests />);
    expect(wrapper.exists()).toBe(true);
  });

  /* Test search filter inputs length */
  test('Should have filter inputs length 4', () => {
    const wrapper = mount(
      <I18nextProvider i18n={i18n}>
        <SearchRequests />
      </I18nextProvider>
    );
    const searchForm = wrapper.find('Form');
    expect(searchForm.find('renderInput').length).toEqual(4);
    expect(searchForm.find('Button')).toHaveLength(1);
  });

  /* Test error message one of the above fields is required */
  test('Error message one of the above fields is required works successfully', () => {
    const wrapper = mount(
      <I18nextProvider i18n={i18n}>
        <SearchRequests />
      </I18nextProvider>
    );
    wrapper.find('Form').simulate('submit');
    wrapper.update();
    const searchForm = wrapper.find('Form');
    expect(searchForm.find('.border-danger').at(0).length).toEqual(1);
    expect(searchForm.find('.invalid-feedback').length).toEqual(1);
    expect(searchForm.find('.invalid-feedback').text()).toEqual(`* ${I18n.t('validation.oneOfTheAboveFieldsIsRequired')}`);
  });

  /* Test for table element would not exists in SearchRequests*/
  test('SearchRequests renders without table element would exists', () => {
    const wrapper = mount(
      <I18nextProvider i18n={i18n}>
        <SearchRequests />
      </I18nextProvider>
    );
    expect(wrapper.find('table')).toHaveLength(0);
  });

  /* Test SearchRequests have certain states */
  test('SearchRequests have certain states', () => {
    const wrapper = mount(
      <I18nextProvider i18n={i18n}>
        <SearchRequests />
      </I18nextProvider>
    );
    const PAGE_LIMIT = 10;
    //console.log(wrapper.debug());
    expect(wrapper.find('SearchRequests').state().apiFetched).toBe(false)
    expect(wrapper.find('SearchRequests').state().loading).toBe(false)
    expect(wrapper.find('SearchRequests').state().totalCases).toBe(0)
    expect(wrapper.find('SearchRequests').state().limit).toBe(PAGE_LIMIT)
    expect(wrapper.find('SearchRequests').state().searchQuery).toEqual({})
  });

  /* Test form clear button works correctly */
  test('form should have contains clear button and works', () => {
    const wrapper = mount(
      <Router>
        <I18nextProvider i18n={i18n}>
          <SearchRequests kc={mockKcProps} />
        </I18nextProvider>
      </Router>
    );

    let form = wrapper.find('Form');
    let imei = form.find('renderInput').at(0);
    imei.find('Input').simulate('change', {
      target: {
        value: '11111111111111',
        name: 'imei'
      }
    });

    const submitButton = wrapper.find('Button').at(0).find('button');
    submitButton.simulate('submit');

    // simulating a server response
    let responseObj = {
      data: {
        cases: [
          {
            pair_code: "dm9Y6JY5",
            imei: "11111111111111",
            brand: "TEST",
            model: "MODEL test",
            serial_no: "12234abcdef11",
            mac: "3D-2F-AB-4A-7C:FD",
            contact: "923145309688",
            is_active: "Used"
          }
        ],
        count: 1,
        limit: 10,
        start: 1
      }
    };

    mockAxios.mockResponse(responseObj);
    wrapper.update();
    expect(wrapper.find('.selected-filters li')).toHaveLength(1);
    form = wrapper.find('Form');
    const clearButton = form.find('Button').at(0);
    expect(clearButton.find('button').props().disabled).toBe(false);

    clearButton.simulate('click');
    wrapper.update();
    form = wrapper.find('Form');
    imei = form.find('renderInput').at(0);
    expect(imei.find('Input').props().value).toEqual('');
    expect(wrapper.find('.selected-filters')).toHaveLength(0);
  });

  test("if search button clicked then call API and show records", () => {
    const wrapper = mount(
      <Router>
        <I18nextProvider i18n={i18n}>
          <SearchRequests kc={mockKcProps} />
        </I18nextProvider>
      </Router>
    );

    const form = wrapper.find('Form');
    const imei = form.find('renderInput').at(0);
    imei.find('Input').simulate('change', {
      target: {
        value: '11111111111111',
        name: 'imei'
      }
    });

    const submitButton = wrapper.find('Button').at(0).find('button');
    submitButton.simulate('submit');

    // simulating a server response
    let responseObj = {
      data: {
        cases: [
          {
            pair_code: "dm9Y6JY5",
            imei: "11111111111111",
            brand: "TEST",
            model: "MODEL test",
            serial_no: "12234abcdef11",
            mac: "3D-2F-AB-4A-7C:FD",
            contact: "923145309688",
            is_active: "Used"
          }
        ],
        count: 1,
        limit: 10,
        start: 1
      }
    };

    mockAxios.mockResponse(responseObj);
    wrapper.update();
    expect(mockAxios.post).toHaveBeenCalledWith('/authority-search?start=0&limit=10', {
      "limit": 10,
      "search_args": {
        "IMEI": '11111111111111'
      },
      "start": 0
    }, mockHeader);
    expect(wrapper.find('SearchRequests').state().totalCases).toEqual(1);
    expect(wrapper.find('SearchRequests').find('.listbox table')).toHaveLength(1);
    expect(wrapper.find('.listbox table tbody tr td')).toHaveLength(8);
    expect(wrapper.find('.listbox .text-primary').text()).toEqual(`1 ${I18n.t('RequestFound')}`);
  });
  
});