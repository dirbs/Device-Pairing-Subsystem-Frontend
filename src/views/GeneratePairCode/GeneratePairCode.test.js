/*
Copyright (c) 2018 Qualcomm Technologies, Inc.
All rights reserved.

Redistribution and use in source and binary forms, with or without modification, are permitted (subject to the limitations in the disclaimer below) provided that the following conditions are met:

* Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
* Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
* Neither the name of Qualcomm Technologies, Inc. nor the names of its contributors may be used to endorse or promote products derived from this software without specific prior written permission.
NO EXPRESS OR IMPLIED LICENSES TO ANY PARTY'S PATENT RIGHTS ARE GRANTED BY THIS LICENSE. THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/

import React from 'react';
import {shallow, mount} from 'enzyme';
import GeneratePairCode from './GeneratePairCode';
import MyEnhancedForm from './GeneratePairCode';
import {I18nextProvider} from 'react-i18next';
import i18n from './../../i18nTest';
import I18n from "i18next";
import mockAxios from 'jest-mock-axios';

const mockInvalidInput = 'XsWcQSL9ohTM0iayfeRZ7jI5o3Vnb9MSS6dd1tnJrr5W3QqZL4zpfKZCNlLDDXuoXktYlx5DNKgQ2' +
  '6vDdHWMHDyhzKLAzVrdLjVDh9QHmT1tVMfaHJbL3lSKvcQ9kYhdiemzVtvEQLGkjbG7fcJLRYLcfec2yKjy7Juuvdby' +
  'Et34XNz39ZBNzs9WMbRCfN8cTYQn4XIpoD2WaD6BtXnsHy1tyyxFWon4zn8cgWwcLVaHx1CmIGCwqztDFT9Na1vLGslz' +
  'kDrWb19X2SJ0BmuB6DO8F8tNXAK6iqlnRmuLy3mdGnMedEbyE1nsJWTdSoNCZe185zaoyug5IT5RvbWwl2zPJgP2' +
  '3wSQLSAXeGNBiZmKrI24gTuzkr2aadybYdevYqTjEPPoh4sxdUiuG4h6hPpuJMD0m7LoK0cMDh3urJ0el7ViKste' +
  'gCuK1V0VhvcCltflEaUIeA2YskT0pbkWImAQyV2jo9uFVR6wRpTWB2TkuJXkXZZ6iPYT4chmA5KBoa7wqwVb7Uzi0y' +
  's4neeXXVWeWDqqbidl5bnIKpuNf7vBcLhApW4N14PINajCi6b6ZuBvrOx6woHuh7wPAN2mKLrs8fGqaqALpaHGlc5j' +
  'd6295wXRHpcGMLBWK7NrdYirL9uBy4FTVDllwJYbQ1CDcKDsxyY0BDNiw3yqSglCuKj4rAMlFVuGcOeyT1nN4AAC2O' +
  'R2xwkhpHsH3jQYp5S09mZ4ELlWveHLqNoJB3UkXZHILQasO4OcT7Rd7pRk2PGvRjORnH4QCNxVFXD3n2Gcb1z0H5Ga' +
  '0DluifjqankatFQY5m80CeLcfAubTK3B8vMbbY7W4gXa9wkXGO4crxXKspLcNzGbGEOoj16KjqvePhtkUgvtbnIrtWU' +
  'LGYZ1M7Kjk6xRFZKX8ScJSdGAtA9825BTQSm2smZfFTcaZvjJTl4gncBl5LRpUi9SBcDEWwlQ8M2B3RUxAVr6m2Z6OWO4' +
  'TlKZ9D7IRF47MUjRkF6ws'

describe('Generate Pair Code component', () => {

  /* Test if render successfully */
  test('If render correctly', () => {
    const wrapper = shallow(<GeneratePairCode/>);
    expect(wrapper).toMatchSnapshot();
  });

  /* Test generate pair code render */
  test('If generate pair code render', () => {
    const wrapper = shallow(<GeneratePairCode/>);
    expect(wrapper.exists()).toBe(true);
  });

  /* Test double entry inputs length */
  test('If double entry inputs length', () => {
    const wrapper = mount(
      <I18nextProvider i18n={i18n}>
        <MyEnhancedForm/>
      </I18nextProvider>
    );
    expect(wrapper.find('doubleEntryInput').length).toEqual(6);
  });

  /* Test simple inputs length */
  test('If render inputs length', () => {
    const wrapper = mount(
      <I18nextProvider i18n={i18n}>
        <MyEnhancedForm/>
      </I18nextProvider>
    );
    expect(wrapper.find('renderInput').length).toEqual(3);
  });

  /* Test render select length */
  test('If render select length', () => {
    const wrapper = mount(
      <I18nextProvider i18n={i18n}>
        <MyEnhancedForm/>
      </I18nextProvider>
    );
    expect(wrapper.find('RenderSelect').length).toEqual(1);
  });

  /* Test generate pair code form submit successfully */
  test('If generate pair code submit successfully', () => {
    const wrapper = mount(
      <I18nextProvider i18n={i18n}>
        <MyEnhancedForm/>
      </I18nextProvider>
    );
    wrapper.find('.btn-next-prev').at(0).simulate('click');
    wrapper.update();
    expect(wrapper.find('errors').length).toEqual(0);
  });

  /* Test device imei min length equal to 1 */
  test('If device consists of minimum imei 1', () => {
    const wrapper = mount(
      <I18nextProvider i18n={i18n}>
        <MyEnhancedForm/>
      </I18nextProvider>
    );
    const deviceImeiWrap = wrapper.find('.add-remove-wrap');
    expect(deviceImeiWrap.find('doubleEntryInput').length).toEqual(2);
  });

  /* Test device imei max length equal to 5 */
  test('If max number of IMEIs is 5', () => {
    const wrapper = mount(
      <I18nextProvider i18n={i18n}>
        <MyEnhancedForm/>
      </I18nextProvider>
    )
    //Number of rows
    expect(wrapper.find('FieldArray').find('Row').length).toEqual(1)

    //Add IMEI
    let addIMEIbtn = wrapper.find('FieldArray').find('button').find('.btn-outline-primary')
    addIMEIbtn.simulate('click')

    wrapper.update()

    //Number of rows
    expect(wrapper.find('FieldArray').find('Row').length).toEqual(2)

    //Add IMEI
    addIMEIbtn = wrapper.find('FieldArray').find('button').find('.btn-outline-primary')
    addIMEIbtn.simulate('click')
    wrapper.update()

    //Number of rows
    expect(wrapper.find('FieldArray').find('Row').length).toEqual(3)

    //Add IMEI
    addIMEIbtn = wrapper.find('FieldArray').find('button').find('.btn-outline-primary')
    addIMEIbtn.simulate('click')
    wrapper.update()

    //Number of rows
    expect(wrapper.find('FieldArray').find('Row').length).toEqual(4)

    //Add IMEI
    addIMEIbtn = wrapper.find('FieldArray').find('button').find('.btn-outline-primary')
    addIMEIbtn.simulate('click')
    wrapper.update()

    //Number of rows
    expect(wrapper.find('FieldArray').find('Row').length).toEqual(5)

    //Add IMEI button disabled
    expect(wrapper.find('FieldArray').find('button').find('.btn-outline-primary').props().disabled).toBe(true)
  });

  test('If delete IMEI btn triggers correctly', () => {
    const wrapper = mount(
      <I18nextProvider i18n={i18n}>
        <MyEnhancedForm/>
      </I18nextProvider>
    )
    //Number of rows
    expect(wrapper.find('FieldArray').find('Row').length).toEqual(1)

    //Add IMEI
    let addIMEIbtn = wrapper.find('FieldArray').find('button').find('.btn-outline-primary')
    addIMEIbtn.simulate('click')
    wrapper.update()

    //Number of rows
    expect(wrapper.find('FieldArray').find('Row').length).toEqual(2)

    //Remove IMEI
    let removeIMEIbtn = wrapper.find('FieldArray').find('button').find('.button-remove')
    removeIMEIbtn.simulate('click')
    wrapper.update()

    //Number of rows
    expect(wrapper.find('FieldArray').find('Row').length).toEqual(1)
  });

  test('If IMEI validations runs correctly', () => {
    const wrapper = mount(
      <I18nextProvider i18n={i18n}>
        <MyEnhancedForm/>
      </I18nextProvider>
    )

    //Add IMEI
    let addIMEInput = wrapper.find('FieldArray').find('input').at(0)
    addIMEInput.simulate('change', {
      target: {
        name: 'imeis[0].imei',
        value: '12345zz7'
      }
    })
    //Add ReIMEI
    let addReIMEInput = wrapper.find('FieldArray').find('input').at(1)
    addReIMEInput.simulate('change', {
      target: {
        name: 'imeis[0].reImei',
        value: '12345zz7'
      }
    })

    //Tests
    expect(wrapper.find('Formik').state().errors.imeis[0].imei).toEqual(I18n.t('validation.imeiMustContain'))
    expect(wrapper.find('Formik').state().errors.imeis[0].reImei).toEqual(I18n.t('validation.imeiMustContain'))

    //Brand validation
    let brandInput = wrapper.find('input').find({name: "brand"})
    brandInput.simulate('change', {
      target: {
        name: 'brand',
        value: '**'
      }
    })
    //Test
    expect(wrapper.find('Formik').state().errors.brand).toEqual(I18n.t('validation.brandMustContainCharactersAndACombinationOf'))

    brandInput = wrapper.find('input').find({name: "brand"})
    brandInput.simulate('change', {
      target: {
        name: 'brand',
        value: mockInvalidInput
      }
    })
    //Test
    expect(wrapper.find('Formik').state().errors.brand).toEqual(I18n.t('validation.brandMustBe1000CharactersOrLess'))

    //Model name
    let modelNameInput = wrapper.find('input').find({name: "model_name"})
    modelNameInput.simulate('change', {
      target: {
        name: 'model_name',
        value: '**'
      }
    })
    //Test
    expect(wrapper.find('Formik').state().errors.model_name).toEqual(I18n.t('validation.modelNameMustContainCharactersAndACombinationOf'))

    modelNameInput = wrapper.find('input').find({name: "model_name"})
    modelNameInput.simulate('change', {
      target: {
        name: 'model_name',
        value: mockInvalidInput
      }
    })
    //Test
    expect(wrapper.find('Formik').state().errors.model_name).toEqual(I18n.t('validation.modelNameMustBe1000CharactersOrLess'))

    //Serial number
    let serialNumInput = wrapper.find('input').find({name: "serial_no"})
    serialNumInput.simulate('change', {
      target: {
        name: 'serial_no',
        value: '**'
      }
    })
    //Test
    expect(wrapper.find('Formik').state().errors.serial_no).toEqual(I18n.t('validation.serialNumberMustContainCharactersAndACombinationOf'))

    serialNumInput = wrapper.find('input').find({name: "serial_no"})
    serialNumInput.simulate('change', {
      target: {
        name: 'serial_no',
        value: mockInvalidInput
      }
    })
    //Test
    expect(wrapper.find('Formik').state().errors.serial_no).toEqual(I18n.t('validation.serialNumberMustBe1000CharactersOrLess'))

    //Re type serial number
    serialNumInput = wrapper.find('input').find({name: "serial_no"})
    serialNumInput.simulate('change', {
      target: {
        name: 'serial_no',
        value: 123455
      }
    })
    let reTypeserialNumInput = wrapper.find('input').find({name: "retype_serial_no"})
    reTypeserialNumInput.simulate('change', {
      target: {
        name: 'retype_serial_no',
        value: 1234
      }
    })

    //Test
    expect(wrapper.find('Formik').state().errors.retype_serial_no).toEqual(I18n.t('validation.enteredSerialNumberDoesnTMatch'))

    //MAC validation
    let macInput = wrapper.find('input').find({name: "mac"})
    macInput.simulate('change', {
      target: {
        name: 'mac',
        value: 123455
      }
    })
    let reTypeMacInput = wrapper.find('input').find({name: "retype_mac"})
    reTypeMacInput.simulate('change', {
      target: {
        name: 'retype_mac',
        value: 1234
      }
    })

    //Test
    expect(wrapper.find('Formik').state().errors.mac).toEqual(I18n.t('validation.invalidFormatValidFormatsAreGivenInDescription'))
    expect(wrapper.find('Formik').state().errors.retype_mac).toEqual(I18n.t('validation.enteredMacAddressDoesnTMatch'))

    //MSISDN validation
    let msisdnInput = wrapper.find('input').find({name: "ref_msisdn"})
    msisdnInput.simulate('change', {
      target: {
        name: 'ref_msisdn',
        value: 'abc'
      }
    })

    //Test
    expect(wrapper.find('Formik').state().errors.ref_msisdn).toEqual(I18n.t('validation.invalidFormatValidFormatIs3001234567891'))
  })

  test('If IMEI dosnt match', () => {
    const wrapper = mount(
      <I18nextProvider i18n={i18n}>
        <MyEnhancedForm/>
      </I18nextProvider>
    )

    //Add IMEI
    let addIMEInput = wrapper.find('input').find({name: 'imeis[0].imei'})
    addIMEInput.simulate('change', {
      target: {
        name: 'imeis[0].imei',
        value: '123456789012345'
      }
    })
    //Add ReIMEI
    let addReIMEInput = wrapper.find('input').find({name: 'imeis[0].reImei'})
    addReIMEInput.simulate('change', {
      target: {
        name: 'imeis[0].reImei',
        value: '12345678901234'
      }
    })
    //Tests
    expect(wrapper.find('Formik').state().errors.imeis[0].reImei).toEqual(I18n.t('validation.enteredImeiDoesnTMatch'))
  })

  test('If request register successfully', () => {
    let pushSpy = Sinon.spy()
    const wrapper = mount(
      <I18nextProvider i18n={i18n}>
        <GeneratePairCode kc={mockKcProps} history={{push: pushSpy}}/>
      </I18nextProvider>
    )
    //Technologies
    wrapper.find('Formik').setState({
      values: {
        imeis: [{imei: '', reImei: ''}],
        brand: '',
        model_name: '',
        serial_no: '',
        retype_serial_no: '',
        mac: '',
        retype_mac: '',
        ref_msisdn: '',
        technologies: [{label: "2G", value: "2G"}]
      }
    })

    //Add IMEI
    let addIMEInput = wrapper.find('FieldArray').find('input').at(0)
    addIMEInput.simulate('change', {
      target: {
        name: 'imeis[0].imei',
        value: 11111111111111
      }
    })
    //Add ReIMEI
    let addReIMEInput = wrapper.find('FieldArray').find('input').at(1)
    addReIMEInput.simulate('change', {
      target: {
        name: 'imeis[0].reImei',
        value: 11111111111111
      }
    })
    //Brand validation
    let brandInput = wrapper.find('input').find({name: "brand"})
    brandInput.simulate('change', {
      target: {
        name: 'brand',
        value: 'Nokia'
      }
    })
    //Model name
    let modelNameInput = wrapper.find('input').find({name: "model_name"})
    modelNameInput.simulate('change', {
      target: {
        name: 'model_name',
        value: 'Nokia 9'
      }
    })
    //Serial number
    let serialNumInput = wrapper.find('input').find({name: "serial_no"})
    serialNumInput.simulate('change', {
      target: {
        name: 'serial_no',
        value: 12345
      }
    })
    //Re type serial number
    let reTypeserialNumInput = wrapper.find('input').find({name: "retype_serial_no"})
    reTypeserialNumInput.simulate('change', {
      target: {
        name: 'retype_serial_no',
        value: 12345
      }
    })
    //MAC
    let macInput = wrapper.find('input').find({name: "mac"})
    macInput.simulate('change', {
      target: {
        name: 'mac',
        value: ''
      }
    })
    let reTypeMacInput = wrapper.find('input').find({name: "retype_mac"})
    reTypeMacInput.simulate('change', {
      target: {
        name: 'retype_mac',
        value: ''
      }
    })
    //MSISDN
    let msisdnInput = wrapper.find('input').find({name: "ref_msisdn"})
    msisdnInput.simulate('change', {
      target: {
        name: 'ref_msisdn',
        value: 1234567890
      }
    })

    //Form submit
    wrapper.find('form').simulate('submit')

    //API response mock
    let responseObj = {
      data: {"pair_code": "qTDmWKmB", "msg": "Device's information has been successfully loaded"},
      status: 200
    }
    mockAxios.mockResponse(responseObj)

    //Test
    expect(wrapper.find('GeneratePairCode').state().caseSubmitted).toBe(true)
    expect(pushSpy.calledOnce).toBe(true)
  })
})