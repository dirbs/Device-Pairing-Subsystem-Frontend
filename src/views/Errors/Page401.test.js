import React from 'react';

import Page401 from './Page401';
import i18n from './../../i18n';
import { I18nextProvider } from 'react-i18next';
import {BrowserRouter as Router} from 'react-router-dom';

const appDetails = {
  "appName": "lsds",
  "supportEmail": "example@company.com",
  "supportNumber": "+923001234567"
}

const userDetails = {
  preferred_username: "User"
}

const historyMock = { push: jest.fn() };

describe('Page401 component', () => {

    /* Test Page401 renders successfully */
    test('if renders correctly', () => {
        const mockLogout = jest.fn();
        const wrapper = shallow(<Page401 kc={{logout: mockLogout}} userDetails={userDetails}/>);
        expect(wrapper.exists()).toBe(true);
    });

    /* Test Page401 renders again */
    test('if renders again correctly', () => {
        const mockLogout = jest.fn();
        const wrapper = shallow(<Page401 kc={{logout: mockLogout}} userDetails={userDetails}/>);
        expect(wrapper).toMatchSnapshot();
    });

    /* Test Header, specific class, page title, page listing and Footer */
    test('Page401 has class and html elements', () => {
        const mockLogout = jest.fn();
        const wrapper = mount(
            <Router>
                <I18nextProvider i18n={i18n}>
                    <Page401  kc={{logout: mockLogout}} userDetails={userDetails} history={historyMock}/>
                </I18nextProvider>
            </Router>
        );
        expect(wrapper.find('Header').exists()).toBe(true);
        expect(wrapper.find('.p401').length).toEqual(1);
        expect(wrapper.find('.main h1').text()).toEqual('401');
        expect(wrapper.find('.inline-support ul')).toHaveLength(2);
        expect(wrapper.find('Footer').exists()).toBe(true);
    });

})