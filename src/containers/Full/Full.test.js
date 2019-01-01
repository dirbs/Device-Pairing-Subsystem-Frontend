import React from 'react'
import Full from './Full'
import {BrowserRouter as Router} from 'react-router-dom';
import {MemoryRouter} from 'react-router';
import {I18nextProvider} from 'react-i18next';
import i18n from './../../i18n';

describe('Full component', () => {
  describe('Logged in As an AUTHORITY', () => {
    const userDetails = {
      preferred_username: "dps auth user"
    }
    const mockResources = {
      realm_access: {
        roles: [
          "dps_authority_authority"
        ]
      }
    }
    test('/search-requests should redirect to Search Request Page', () => {
      const location = {
        pathname: '/search-requests'
      };
      const wrapper = mount(
        <MemoryRouter initialEntries={['/search-requests']}>
          <I18nextProvider i18n={i18n}>
            <Full resources={mockResources} userDetails={userDetails} kc={mockKcProps} location={location}/>
          </I18nextProvider>
        </MemoryRouter>
      );
      expect(wrapper.find('SearchRequests').length).toEqual(1)
    })
    test('/generate-pair-code should redirect to GeneratePairCode Page', () => {
      const location = {
        pathname: '/generate-pair-code'
      };
      const wrapper = mount(
        <MemoryRouter initialEntries={['/generate-pair-code']}>
          <I18nextProvider i18n={i18n}>
            <Full resources={mockResources} userDetails={userDetails} kc={mockKcProps} location={location}/>
          </I18nextProvider>
        </MemoryRouter>
      );
      expect(wrapper.find('GeneratePairCode').length).toEqual(1)
    })
  })
  describe('Logged in As MNO', () => {
    const userDetails = {
      preferred_username: "mno jazz"
    }
    const mockResources = {
      realm_access: {
        roles: [
          "dps_mno_jazz"
        ]
      }
    }
    test('/imsi-requests should redirect to Requests Page', () => {
      const location = {
        pathname: '/imsi-requests'
      };
      const wrapper = mount(
        <MemoryRouter initialEntries={['/imsi-requests']}>
          <I18nextProvider i18n={i18n}>
            <Full resources={mockResources} userDetails={userDetails} kc={mockKcProps} location={location}/>
          </I18nextProvider>
        </MemoryRouter>
      );
      expect(wrapper.find('Requests').length).toEqual(1)
    })
    test('/bulk-upload should redirect to BulkUpload Page', () => {
      const location = {
        pathname: '/bulk-upload'
      };
      const wrapper = mount(
        <MemoryRouter initialEntries={['/bulk-upload']}>
          <I18nextProvider i18n={i18n}>
            <Full resources={mockResources} userDetails={userDetails} kc={mockKcProps} location={location}/>
          </I18nextProvider>
        </MemoryRouter>
      );
      expect(wrapper.find('BulkUpload').length).toEqual(1)
    })
    test('/bulk-status should redirect to BulkStatus Page', () => {
      const statusDetails = {
        icon: 'fa fa-check',
        response: {
          Deleted_Record: 1,
          Successful_Records: 0,
          Total_Records: 1,
          link: "/var/www/html/dirbs_intl_dps/Downloads/Error-Records_jazz_2018-12-26_09-27-19.csv",
          msg: "File successfully loaded"
        }
      }
      const location = {
        pathname: '/bulk-status',
        state: {
          details: statusDetails
        }
      };
      const wrapper = mount(
        <MemoryRouter initialEntries={['/bulk-status']}>
          <I18nextProvider i18n={i18n}>
            <Full resources={mockResources} userDetails={userDetails} kc={mockKcProps} location={location}/>
          </I18nextProvider>
        </MemoryRouter>
      );
      expect(wrapper.find('BulkStatus').length).toEqual(1)
    })
  })
})