import React from 'react';
import {shallow, mount} from 'enzyme';
import doubleEntryInput from './DoubleEntryInput';
import { Formik, Field } from 'formik';

const groupClass = "test-class";

describe('doubleEntryInput', () => {

  /* Test if render correctly */
  test('should render correctly', () => {
    const wrapper = shallow(<doubleEntryInput />);
    expect(wrapper).toMatchSnapshot();
  });

  /* Test if doubleEntryInput renders successfully */
  test('should render doubleEntryInput successfully', () => {
    const wrapper = shallow(<doubleEntryInput />);
    expect(wrapper.exists()).toBe(true);
  });

  /* Test if props values defined by the user i.e. type, class and max-length */
  test('should render component with type, class and maxLength are defined', () => {
    const wrapper = shallow(<doubleEntryInput type="text" />);
    const typeNumber = shallow(<doubleEntryInput type="number" />);
    const gClass = shallow(<doubleEntryInput groupClass={groupClass} />);
    const maxLength = shallow(<doubleEntryInput maxLength="16" />);

    expect(wrapper.hostNodes().prop('type')).toBe('text');
    expect(typeNumber.hostNodes().prop('type')).toBe('number');
    expect(gClass.hostNodes().prop('groupClass')).toBe('test-class');
    expect(maxLength.hostNodes().prop('maxLength')).toBe('16');
  })

  /* Test should render error if field is required */
  test('should render required icon i.e. *', () => {
    const wrapper = mount(
      <Formik onSubmit={() => {}}>
        <Field name="test" component={doubleEntryInput} type="text" label="test" placeholder="test" requiredStar />
      </Formik>
    );
    expect(wrapper.contains(<span className="text-danger">*</span>)).toBe(true);
  })

  /* Test should renders input values */
  test('should renders input values', () => {
    const wrapper = mount(
      <Formik onSubmit={() => {}}>
        <Field name="test" component={doubleEntryInput} type="text" label="test" placeholder="test" warningStar />
      </Formik>
    );
    expect(wrapper.find('input').props().name).toBe('test');
    expect(wrapper.find('input').props().type).toBe('text');
    expect(wrapper.find('input').props().placeholder).toBe('test');
  })

  /* Test should render label */
  test('should render label', () => {
    const wrapper = mount(
      <Formik onSubmit={() => {}}>
        <Field name="test" component={doubleEntryInput} type="text" label="test" placeholder="test" requiredStar />
      </Formik>
    );
    //console.log(wrapper.debug());
    expect(wrapper.find('label').length).toBe(1);
    expect(wrapper.find('label').text()).toBe('test *');
  })

})