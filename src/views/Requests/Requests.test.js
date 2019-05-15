import React from 'react';
import Requests from './Requests';
import {I18nextProvider} from 'react-i18next';
import i18n from './../../i18n';
import mockAxios from 'jest-mock-axios';
import FileSaver from 'file-saver';

//Mock File-saver
jest.mock('file-saver', ()=>({saveAs: jest.fn()}))
global.Blob = function (content, options){return  ({content, options})}

Object.defineProperty(window, 'getUserRole', {value: Sinon.spy()})
Object.defineProperty(window, 'matchMedia', {
  value: () => ({
    matches: false,
    addListener: () => {
    },
    removeListener: () => {
    }
  })
});

//Mock API responses data
const mockValidIMSI = 123456789012345;
const mockCount = 44067;
const mockLimit = 10;
const mockCountryCode = '92';
const mockCases = [
  {"Req_id": "30cgE65u", "MSISDN": "923110156560"},
  {
    "Req_id": "ArgiuTuL",
    "MSISDN": "923330164747"
  },
  {"Req_id": "cQXijTy3", "MSISDN": "923000151947"},
  {
    "Req_id": "n5s5XUXX",
    "MSISDN": "923340153976"
  },
  {"Req_id": "TuVijIO9", "MSISDN": "923000164790"},
  {
    "Req_id": "ZulfBZID",
    "MSISDN": "923110173964"
  },
  {"Req_id": "rRiRa8mS", "MSISDN": "923340235958"},
  {
    "Req_id": "1s1uyL1x",
    "MSISDN": "923000151815"
  },
  {"Req_id": "r6QCKeI8", "MSISDN": "923330153479"},
  {"Req_id": "WPkwWGfW", "MSISDN": "923000178879"}
];
const getCasesData = {
  "cases": mockCases,
  "country_code": mockCountryCode,
  "next": "/get-pairs?start=10&limit=19",
  "count": mockCount,
  "limit": mockLimit,
  "start": 1,
  "previous": ""
};

//Mock Keycloak user information
const mockUser = 'jazz';
const kcResource = {
  realm_access: {
    roles: ['uma_authorization', `dps_mno_${mockUser}`]
  }
};

describe('Requests component', () => {
  afterEach(() => {
    // cleaning up the mess left behind the previous test
    mockAxios.reset();
  });
  test('Requests render correctly', () => {
    const wrapper = shallow(<Requests/>);
    expect(wrapper).toMatchSnapshot();
  });
  test('If Requests renders', () => {
    const wrapper = shallow(<Requests/>);
    expect(wrapper.exists()).toBe(true);
  });
  test('if state renders correctly after componentDidMount', () => {
    const wrapper = mount(
      <I18nextProvider i18n={i18n}>
        <Requests kc={mockKcProps} resources={kcResource}/>
      </I18nextProvider>
    );

    //API call in componentDidMount
    let getCasesResponse = {
      data: getCasesData,
      status: 200
    };
    mockAxios.mockResponse(getCasesResponse);
    wrapper.update();

    //Tests in state
    expect(wrapper.find('Requests').state().mno).toEqual(mockUser);
    expect(wrapper.find('Requests').state().limit).toEqual(mockLimit);
    expect(wrapper.find('Requests').state().totalCases).toEqual(mockCount);
    expect(wrapper.find('Requests').state().countryCode).toEqual(mockCountryCode);
    expect(wrapper.find('Requests').state().loading).toEqual(false);
    expect(wrapper.find('Requests').state().data).toEqual(mockCases);

    //Tests in DOM
    expect(wrapper.find('Requests').find('table').length).toEqual(1);
    expect(wrapper.find('Requests').find('table tbody tr').length).toEqual(10);
    expect(wrapper.find('DataTableInfo').length).toEqual(1);
  });
  test('if componentDidMount fails', () => {
    const wrapper = mount(
      <I18nextProvider i18n={i18n}>
        <Requests kc={mockKcProps} resources={kcResource}/>
      </I18nextProvider>
    );

    //API call in componentDidMount
    let getCasesErrorResponse = {
      response: {
        data: {
          message: 'In error'
        },
        status: 401
      },
      status: 401
    };
    mockAxios.mockError(getCasesErrorResponse);

    //Tests
    expect(wrapper.find('Requests').state().loading).toEqual(false)
  });
  test('if IMSI table paginates correctly',()=>{
    const wrapper = mount(
      <I18nextProvider i18n={i18n}>
        <Requests kc={mockKcProps} resources={kcResource}/>
      </I18nextProvider>
    );

    //API call in componentDidMount
    let getCasesResponse = {
      data: getCasesData,
      status: 200
    };
    mockAxios.mockResponse(getCasesResponse);
    wrapper.update();

    //Click to paginate to 2nd page
    wrapper.find('Requests').find('.pagination t').at(3).simulate('click');
	  mockAxios.mockResponse(getCasesResponse);
    wrapper.update();
    expect(wrapper.find('Requests').find('.pagination t').at(3).props().isActive).toBe(true)
  });
  test('if download Report correctly',()=>{
    const wrapper = mount(
      <I18nextProvider i18n={i18n}>
        <Requests kc={mockKcProps} resources={kcResource}/>
      </I18nextProvider>
    );

    //API call in componentDidMount
    let getCasesResponse = {
      data: getCasesData,
      status: 200
    };
    mockAxios.mockResponse(getCasesResponse);
    wrapper.update();

    //Download report
    let downloadBtn = wrapper.find('Requests').find('.react-bs-table-pagination button');
    downloadBtn.simulate('click');

    //API call in componentDidMount
    let getDownloadResponse = {
      data: {},
      status: 200
    };
    mockAxios.mockResponse(getDownloadResponse);
    expect(FileSaver.saveAs).toHaveBeenCalledWith(
      {content:[{}], options: { type: 'text/csv;' }},
      'Request-Document.csv'
    )
  });
  test('if add single IMSI modal renders', () => {
    const wrapper = mount(
      <I18nextProvider i18n={i18n}>
        <Requests kc={mockKcProps} resources={kcResource}/>
      </I18nextProvider>
    );

    //API call in componentDidMount
    let getCasesResponse = {
      data: getCasesData,
      status: 200
    };
    mockAxios.mockResponse(getCasesResponse);
    wrapper.update();

    //Click Add IMSI button in a first row
    let addIMSIbtn = wrapper.find('Requests').find('table tbody tr').at(0).find('button');
    addIMSIbtn.simulate('click');
    wrapper.update();

    //Tests in DOM
    expect(wrapper.find('Requests').find('AddIMSIForm').exists()).toEqual(true);
    expect(wrapper.find('Requests').find('Modal').exists()).toEqual(true);
    expect(wrapper.find('Requests').find('ModalHeader').exists()).toEqual(true);
    expect(wrapper.find('Requests').find('ModalBody').exists()).toEqual(true);
    expect(wrapper.find('Requests').find('ModalFooter').exists()).toEqual(true);
    expect(wrapper.find('Requests').find('Modal').props().isOpen).toEqual(true);

    let closeBtn = wrapper.find('Modal').find('button').at(0);
    //Modal closing

    closeBtn.simulate('click');
    wrapper.update();

    //Tests after close button
    expect(wrapper.find('AddIMSIForm').find('Modal').props().isOpen).toEqual(false);

  });
  test('if adds single IMSI validations runs correctly', () => {
    const wrapper = mount(
      <I18nextProvider i18n={i18n}>
        <Requests kc={mockKcProps} resources={kcResource}/>
      </I18nextProvider>
    );

    //API call in componentDidMount
    let getCasesResponse = {
      data: getCasesData,
      status: 200
    };
    mockAxios.mockResponse(getCasesResponse);
    wrapper.update();

    //Click Add IMSI button in a first row
    let addIMSIbtn = wrapper.find('Requests').find('table tbody tr').at(0).find('button');
    addIMSIbtn.simulate('click');

    //Add single IMSI
    let Modal = wrapper.find('Modal');
    let imsiInput = Modal.find('input').at(0);
    let reImsiInput = Modal.find('input').at(1);

    imsiInput.simulate('change',{
      target:{
        name:'imsi',
        value:''
      }
    });
    reImsiInput.simulate('change',{
      target:{
        name:'reImsi',
        value:''
      }
    });
    wrapper.update();

    //Submit form
    Modal = wrapper.find('Modal');
    Modal.find('form').simulate('submit');

    //Test
    expect(wrapper.find('Requests').find('Formik').state().errors.imsi).toEqual('This field is required');
    expect(wrapper.find('Requests').find('Formik').state().errors.reImsi).toEqual('This field is required');

    imsiInput.simulate('change',{
      target:{
        name:'imsi',
        value:'abc'
      }
    });
    reImsiInput.simulate('change',{
      target:{
        name:'reImsi',
        value:'a'
      }
    });
    wrapper.update();

    //Submit form
    Modal = wrapper.find('Modal');
    Modal.find('form').simulate('submit');

    //Test
    expect(wrapper.find('Requests').find('Formik').state().errors.imsi).toEqual('IMSI must be digits only [0-9]');
    expect(wrapper.find('Requests').find('Formik').state().errors.reImsi).toEqual('IMSIs does not match');

    imsiInput.simulate('change',{
      target:{
        name:'imsi',
        value:'1234'
      }
    });
    wrapper.update();

    //Submit form
    Modal = wrapper.find('Modal');
    Modal.find('form').simulate('submit');

    //Test
    expect(wrapper.find('Requests').find('Formik').state().errors.imsi).toEqual('IMSI length should be 15 digits');
  });
  test('if add single IMSI', () => {
    const wrapper = mount(
      <I18nextProvider i18n={i18n}>
        <Requests kc={mockKcProps} resources={kcResource}/>
      </I18nextProvider>
    );

    //API call in componentDidMount
    let getCasesResponse = {
      data: getCasesData,
      status: 200
    };
    mockAxios.mockResponse(getCasesResponse);
    wrapper.update();

    //Click Add IMSI button in a first row
    let addIMSIbtn = wrapper.find('Requests').find('table tbody tr').at(0).find('button');
    addIMSIbtn.simulate('click');

    //Add single IMSI
    let Modal = wrapper.find('Modal');
    let imsiInput = Modal.find('input').at(0);
    let reImsiInput = Modal.find('input').at(1);

    imsiInput.simulate('change',{
      target:{
        name:'imsi',
        value: mockValidIMSI
      }
    });
    reImsiInput.simulate('change',{
      target:{
        name:'reImsi',
        value: mockValidIMSI
      }
    });
    wrapper.update();

    //Submit form
    Modal = wrapper.find('Modal');
    Modal.find('form').simulate('submit');

    //API Call
    let responseObj = {
      data : {
        msg: 'IMSI added successfully'
      },
      status: 200
    };
    mockAxios.mockResponse(responseObj);
    //Get Cases API call
    //API call in componentDidMount
    getCasesResponse = {
      data: getCasesData,
      status: 200
    };
    mockAxios.mockResponse(getCasesResponse);
    wrapper.update();

    //Tests
    expect(wrapper.find('AddIMSIForm').find('Modal').props().isOpen).toEqual(false);
    expect(wrapper.find('Formik').state().values.imsi).toEqual('');
    expect(wrapper.find('Formik').state().values.reImsi).toEqual('');
  });
});