import React from 'react';
import {shallow, mount, render} from 'enzyme';
import BulkUpload from './BulkUpload';
import EnhancedFileForm from './BulkUpload';
import {I18nextProvider} from 'react-i18next';
import i18n from './../../i18nTest';
import sinon from 'sinon';
import mockAxios from 'jest-mock-axios';
import {BrowserRouter as Router} from 'react-router-dom';

//Mock Getting user role
Object.defineProperty(window, 'getUserRole', {value: Sinon.spy()})
//Mock Keycloak user information
const mockUser = 'jazz'
const kcResource = {
  realm_access: {
    roles: ['uma_authorization', `dps_mno_${mockUser}`]
  }
}

/*const mockFile = {
  'file': {
    'data': 'mockData'
  },
  'name': "bulk_dps.csv",
  'type': "file"
}*/
const mockFile = new File([''], 'test.csv', {type: 'csv'});
const mockInvalidFileType = new File([''], 'test.tsv', {type: 'tsv'});
const mockInvalidFileSize = {name: 'test.csv', size: 50000000};

const statusDetails = {
  icon: 'fa fa-check',
  response: {}
}

const location = {
  pathname: '/bulk-status',
  state: {details: statusDetails}
}

const historyMock = {push: jest.fn()};

describe('Bulk upload module', () => {
  afterEach(() => {
    // cleaning up the mess left behind the previous test
    mockAxios.reset();
  });
  test('if render correctly', () => {
    const wrapper = shallow(<BulkUpload/>);
    expect(wrapper).toMatchSnapshot();
  });
  test('if render again correctly', () => {
    const wrapper = render(
      <Router>
        <I18nextProvider i18n={i18n}>
          <BulkUpload/>
        </I18nextProvider>
      </Router>
    );
    expect(wrapper).toMatchSnapshot();
  });
  test('if initial state renders correctly', () => {
    const wrapper = mount(
      <I18nextProvider i18n={i18n}>
        <BulkUpload resources={kcResource}/>
      </I18nextProvider>
    );

    //Test
    expect(wrapper.find('BulkUpload').state().mno).toEqual(mockUser)
    expect(wrapper.find('BulkUpload').state().loading).toEqual(false)
  })
  test('if loading correctly', () => {
    const wrapper = mount(
      <I18nextProvider i18n={i18n}>
        <BulkUpload resources={kcResource}/>
      </I18nextProvider>
    );

    //Setting loading active
    wrapper.find('BulkUpload').setState({
      loading: true
    })
    wrapper.update()
    //Test
    expect(wrapper.find('BulkUpload').find('StepLoading').length).toEqual(1)
    expect(wrapper.find('BulkUpload').state().loading).toEqual(true)
  })
  test('if renders file input', () => {
    const wrapper = mount(
      <I18nextProvider i18n={i18n}>
        <BulkUpload resources={kcResource}/>
      </I18nextProvider>
    );

    //Test
    expect(wrapper.find('RenderFileInput')).toHaveLength(1)
    expect(wrapper.find('input')).toHaveLength(1)
    expect(wrapper.find('input').props().type).toEqual('file')
  })
  test('if validations runs correctly', () => {
    const wrapper = mount(
      <I18nextProvider i18n={i18n}>
        <BulkUpload kc={mockKcProps} resources={kcResource}/>
      </I18nextProvider>
    );

    //Setting file
    wrapper.find('Formik').setState({
      values: {
        file: mockInvalidFileType
      }
    })
    wrapper.update()

    //Submit form
    wrapper.find('form').simulate('submit')

    //Test
    // console.log(wrapper.find('Formik').state())
    expect(wrapper.find('Formik').state().errors.file).toEqual('Invalid file extension, only support "csv"')

    //Setting file
    wrapper.find('Formik').setState({
      values: {
        file: ''
      }
    })
    wrapper.update()

    //Submit form
    wrapper.find('form').simulate('submit')

    //Test
    // console.log(wrapper.find('Formik').state())
    expect(wrapper.find('Formik').state().errors.file).toEqual('This field is required')

    //Setting file
    wrapper.find('Formik').setState({
      values: {
        file: mockInvalidFileSize
      }
    })
    wrapper.update()

    //Submit form
    wrapper.find('form').simulate('submit')

    //Test
    expect(wrapper.find('Formik').state().errors.file).toEqual('File size limit exceeds from 5MB')
  })
  test('if validations runs correctly', () => {
    let pushSpy = Sinon.spy()
    const wrapper = mount(
      <I18nextProvider i18n={i18n}>
        <BulkUpload kc={mockKcProps} resources={kcResource} history={{push: pushSpy}}/>
      </I18nextProvider>
    );

    //Setting file
    wrapper.find('Formik').setState({
      values: {
        file: mockFile
      }
    })
    wrapper.update()

    //Submit form
    wrapper.find('form').simulate('submit')

    //API call mock
    let bulkUploadResponse = {
      data: {
        "Successful_Records": 0,
        "Deleted_Record": 1,
        "Total_Records": 1,
        "msg": "File successfully loaded",
        "link": "/var/www/html/dirbs_intl_dps/Downloads/Error-Records_jazz_2018-12-22_14-50-40.csv"
      },
      status: 200
    }
    mockAxios.mockResponse(bulkUploadResponse)
    wrapper.update()

    expect(pushSpy.calledOnce).toBe(true)
  })
})
/*
describe('BulkUpload component', () => {

  /!* Test if render successfully *!/
  test('If render correctly', () => {
    const wrapper = shallow(<BulkUpload />);
    expect(wrapper).toMatchSnapshot();
  });

  /!* Test should have render again successfully *!/
  test('should have render again correctly', () => {
    const mockHandleRequestStatus = jest.fn();
    const wrapper = render(
      <Router>
        <I18nextProvider i18n={i18n}>
          <BulkUpload />
        </I18nextProvider>
      </Router>
    );
    expect(wrapper).toMatchSnapshot();
  });

  /!* Test Tab-delimited file input submit *!/
  test("Tab-delimited file input submit", () => {
    const spy = sinon.spy();
    const wrapper = mount(
      <I18nextProvider i18n={i18n}>
        <EnhancedFileForm bulkUpload={spy}/>
      </I18nextProvider>
    );
    const form = wrapper.find('FileInputForm');
    form.setState({bulkFile: mockFile});
    const submit = form.find('button');

    submit.simulate("click");
    wrapper.update();
    expect(form.props().values).toEqual({'file': ""});
  });

})

describe('Bulk verify form component', () => {

  /!* Test EnhancedFileForm consist RenderFileInput *!/
  test('EnhancedFileForm consists RenderFileInput', () => {
    const wrapper = mount(
      <I18nextProvider i18n={i18n}>
        <EnhancedFileForm />
      </I18nextProvider>
    );
    const form = wrapper.find('FileInputForm');
    expect(form.find('RenderFileInput').length).toEqual(1);
  });

  /!* Test form props renders correctly *!/
  test('form props renders correctly', () => {
    const wrapper = mount(
      <I18nextProvider i18n={i18n}>
        <EnhancedFileForm />
      </I18nextProvider>
    );
    const form = wrapper.find('FileInputForm');
    expect(form.props().errors).toEqual({});
    expect(form.props().isSubmitting).toBe(false);
    expect(form.props().touched).toEqual({});
    expect(form.props().values.file).toEqual('');
    expect(form.find('button').length).toEqual(1);
  });

})*/
