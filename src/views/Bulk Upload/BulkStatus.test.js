import React from 'react';
import {shallow} from 'enzyme';
import BulkStatus from './BulkStatus';
import mockAxios from 'jest-mock-axios';
import FileSaver from "file-saver";
import i18n from './../../i18n';

//Mock File-saver
jest.mock('file-saver', ()=>({saveAs: jest.fn()}))
global.Blob = function (content, options){return  ({content, options})}

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

const  location = {
  pathname: '/bulk-status',
  state: {details: statusDetails}
}

const historyMock = { push: jest.fn() };

describe('BulkStatus component', () => {

  test('BulkStatus renders successfully', () => {
    const wrapper = shallow(<BulkStatus location={location} />);
    expect(wrapper.exists()).toBe(true);
  });

  test('if renders again correctly', () => {
      const wrapper = shallow(<BulkStatus location={location} history={historyMock} />);
      expect(wrapper).toMatchSnapshot();
  });
  test('if props receives correctly',()=>{
    const wrapper = mount(<BulkStatus location={location} history={historyMock} />);
    expect(wrapper.contains(<i className='fa fa-check'></i>)).toBe(true);
    expect(wrapper.find('table').length).toEqual(1)

    //Status details
    expect(wrapper.find('table tr').at(0).find('td').text()).toEqual('1')
    expect(wrapper.find('table tr').at(1).find('td').text()).toEqual(`1 ${i18n.t('clickToDownload')}`)
    expect(wrapper.find('table tr').at(2).find('td').text()).toEqual('0')

  })

  test('if it download file',()=>{
    const wrapper = mount(<BulkStatus kc={mockKcProps} location={location} history={historyMock} />);
    const btn = wrapper.find('button')
    btn.simulate('click')

    //API call
    let getDownloadResponse = {
      data: {},
      status: 200
    }
    mockAxios.mockResponse(getDownloadResponse)
    expect(FileSaver.saveAs).toBeCalled()
  })

})