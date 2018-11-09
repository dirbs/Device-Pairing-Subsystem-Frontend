/*
Copyright (c) 2018 Qualcomm Technologies, Inc.
All rights reserved.

Redistribution and use in source and binary forms, with or without modification, are permitted (subject to the limitations in the disclaimer below) provided that the following conditions are met:

* Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
* Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
* Neither the name of Qualcomm Technologies, Inc. nor the names of its contributors may be used to endorse or promote products derived from this software without specific prior written permission.
NO EXPRESS OR IMPLIED LICENSES TO ANY PARTY'S PATENT RIGHTS ARE GRANTED BY THIS LICENSE. THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/

import React, { Component } from 'react';
import { translate, I18n } from 'react-i18next';
import {Row, Col, Button, Form, Card, CardHeader, CardBody } from 'reactstrap';
import { withFormik, Field, FieldArray } from 'formik';
import {errors, instance, getAuthHeader} from "../../utilities/helpers";
import doubleEntryInput from '../../components/Form/DoubleEntryInput'
import renderInput from '../../components/Form/RenderInput'
import RenderSelect from '../../components/Form/RenderSelect'
import {COUNTRY_CODE} from '../../utilities/constants'
import { toast } from 'react-toastify';

export function errorClass(errors, touched, i) {
  return (errors &&
            errors.imeis &&
            errors.imeis[i] &&
            errors.imeis[i]['imei'] &&
            touched &&
            touched.imeis &&
            touched.imeis[i] &&
            touched.imeis[i]['imei']) ? 'is-invalid' : '';

}

class CaseForm extends Component {
  render() {
    const {
      values,
      touched,
      errors,
      isSubmitting,
      handleSubmit,
      setFieldValue,
      setFieldTouched
    } = this.props;
    return (
      <Form onSubmit={handleSubmit}>
        <Row>
          <Col xs={12} xl={4} className="order-xl-12 mt-3">
            <div>
              <div className="alert alert-info mb-2"><b> Device IMEI(s):</b>
                <ul>
                  <li>IMEI can contain alphanumeric characters (0-9, A-F). The length of the IMEI should be between 14-16 characters. </li>
                  <li>In a single request up to 5 IMEI numbers can be added.</li>
                </ul>
              </div>
              <div className="alert alert-info"><b> Mac (Wi-Fi) Address:</b>
                <ul>
                  <li>MAC addresses are 6-byte (48 bits) in length, and are written in the following formats:
                    <ul>
                      <li>A2:C9:66:F8:47:C5</li>
                      <li>A2-C9-66-F8-47-C5</li>
                      <li>A2C.966.F84.7C5</li>
                      <li>00:25:96:FF:FE:12:34:56</li>
                      <li>0025:96FF:FE12:3456</li>
                    </ul>
                  </li>
                </ul>
              </div>
            </div>
          </Col>
          <Col xs={12} xl={8} className="order-xl-1 mt-3">
            <Card>
              <CardHeader><b>Device IMEI(s)</b></CardHeader>
              <CardBody>
                <div className="add-remove-wrap position-relative">
                  <FieldArray
                      name="imeis"
                      render={({ insert, remove, push }) => {
                        return (
                          <div>
                            {values.imeis && values.imeis.length > 0 && values.imeis.map((imei, i) => {
                              let inputClass = errorClass(errors, touched, i);
                              let reInputClass = errorClass(errors, touched, i);
                              return (
                              <Row key={i} className="mt-3">
                                <Col xs={6}>
                                  <Field name={`imeis[${i}].imei`} component={doubleEntryInput} label="Type IMEI" type="text" placeholder={`Type IMEI ${i + 1}`} requiredStar groupClass="mb-0" inputClass={inputClass} />
                                  {errors &&
                                    errors.imeis &&
                                    errors.imeis[i] &&
                                    errors.imeis[i]['imei'] &&
                                    touched &&
                                    touched.imeis &&
                                    touched.imeis[i] &&
                                    touched.imeis[i]['imei'] &&
                                    (
                                      <span className="invalid-feedback p-0" style={{display: 'block'}}>{errors.imeis[i]['imei']}</span>
                                    )}
                                </Col>
                                <Col xs={6}>
                                  <div className="buttonbox">
                                  <Field name={`imeis[${i}].reImei`} component={doubleEntryInput} label="Retype IMEI" type="text" placeholder={`Retype IMEI ${i + 1}`} requiredStar groupClass="mb-0" inputClass={reInputClass} />
                                    {errors &&
                                    errors.imeis &&
                                    errors.imeis[i] &&
                                    errors.imeis[i]['reImei'] &&
                                    touched &&
                                    touched.imeis &&
                                    touched.imeis[i] &&
                                    touched.imeis[i]['reImei'] &&
                                    (
                                      <span className="invalid-feedback p-0" style={{display: 'block'}}>{errors.imeis[i]['reImei']}</span>
                                    )}
                                  {i !== 0 && <button
                                    type="button"
                                    className="button button-remove"
                                    onClick={() => remove(i)}
                                  ></button>}
                                  </div>
                                </Col>
                              </Row>
                            )})}
                            {/*<Field name="duplicateImeis" render={({*/}
                                                                    {/*field, // { name, value, onChange, onBlur }*/}
                                                                    {/*form: {touched, errors}, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.*/}
                                                                    {/*...props*/}
                                                                  {/*}) => (*/}
                              {/*<div> {errors['duplicateImeis'] && <span className="invalid-feedback"*/}
                                                                       {/*style={{display: 'block'}}>* {errors[field.name]}</span>} </div>*/}
                            {/*)}/>*/}
                            <Button
                              type="button"
                              className={values.imeis.length >= 5 ? 'btn btn-outline-primary mt-3 d-none text-capitalize': 'btn btn-outline-primary mt-3 text-capitalize'}
                              onClick={() => push({ imei: "", reImei: "" })}
                              disabled={values.imeis.length >= 5}
                            >
                              Add IMEIs
                            </Button>
                          </div>
                        )}}
                    />
                </div>
              </CardBody>
            </Card>
            <Card>
              <CardHeader><b>Device Identifiers</b></CardHeader>
              <CardBody>
                
                <Row>
                  <Col xs={12} sm={6}>
                    <Field name="serial_no" component={doubleEntryInput} label="Serial number" type="text" placeholder="Serial number" requiredStar maxLength={1000} />
                  </Col>
                  <Col xs={12} sm={6}>
                    <Field name="retype_serial_no" component={doubleEntryInput} label="Retype Serial number" type="text" placeholder="Retype Serial number" requiredStar  maxLength={1000} />
                  </Col>
                </Row>

                <Row>
                  <Col xs={12} sm={6}>
                    <Field name="brand" component={renderInput} label="Brand" type="text" placeholder="Brand" requiredStar />
                  </Col>
                  <Col xs={12} sm={6}>
                    <Field name="model_name" component={renderInput} label="Model Name" type="text" placeholder="Model Name" requiredStar />
                  </Col>
                </Row>
                
                <Row>
                  <Col xs={12} sm={6}>
                    <Field name="mac" component={doubleEntryInput} label="MAC (Wi-Fi) address" type="text" placeholder="MAC (Wi-Fi) address" maxLength={23} />
                  </Col>
                  <Col xs={12} sm={6}>
                    <Field name="retype_mac" component={doubleEntryInput} label="Retype MAC (Wi-Fi) address" type="text" placeholder="Retype MAC (Wi-Fi) address" maxLength={23} />
                  </Col>
                </Row>
                
                <Row>
                  <Col xs={12} sm={6}>
                    <RenderSelect
                      value={values.technologies}
                      onChange={setFieldValue}
                      options={[{label: '2G', value: '2G'}, {label: '3G', value: '3G'}, {label: '4G', value: '4G'}, {label: '5G', value: '5G'}]}
                      onBlur={setFieldTouched}
                      error={errors.technologies}
                      touched={touched.technologies}
                      fieldName="technologies"
                      label="Radio Access Technologies"
                      placeholder="Select Technologies"
                      requiredStar
                      stayOpen={true}
                      multi={true}
                    />
                  </Col>
                  <Col xs={12} sm={6}>
                    <Field name="ref_msisdn" component={renderInput} label="Reference MSISDN" type="text" placeholder="Reference MSISDN" requiredStar maxLength={15} groupClass="prefix-group" prefix={COUNTRY_CODE} />
                  </Col>
                </Row>
                
              </CardBody>
            </Card>
            <div className="text-right">
              <Button color="primary" type="submit" className="btn-next-prev" disabled={isSubmitting} role="button">Submit</Button>
            </div>
          </Col>
        </Row>
      </Form>
    );
  }
}

const MyEnhancedForm = withFormik({
  mapPropsToValues: () => ({ "imeis": [{imei: '', reImei: ''}], "serial_no": "", "retype_serial_no": "", "brand": "", "model_name": "", "mac": "", "retype_mac":"", "technologies": [], "ref_msisdn": "" }),

  // Custom sync validation
  validate: values => {
    let errors = {};
    let imeis = [];
    if (values.imeis.length > 0) {
      for (let i = 0; i < values.imeis.length; i++) {
        if(typeof errors.imeis === "undefined") {
            errors.imeis = [];
        }
        if(typeof errors.imeis[i] === "undefined") {
            errors.imeis[i] = {};
        }


        if (!values.imeis[i].imei) {
          errors.imeis[i].imei = 'This field is required'
        } else if(!/^(?=.[A-F]*)(?=.[0-9]*)[A-F0-9]{14,16}$/.test(values.imeis[i].imei)){
          errors.imeis[i].imei = 'IMEI must contain 14 to 16 characters and contains a combination of [0-9] and [A-F]'
        }

        if (!values.imeis[i].reImei) {
          errors.imeis[i].reImei = 'This field is required'
        } else if(!/^(?=.[A-F]*)(?=.[0-9]*)[A-F0-9]{14,16}$/.test(values.imeis[i].reImei)){
          errors.imeis[i].reImei = 'IMEI must contain 14 to 16 characters and contains a combination of [0-9] and [A-F]'
        } else if (values.imeis[i].imei !== values.imeis[i].reImei) {
            errors.imeis[i].reImei = 'Entered IMEI doesn\'t match'
        }
        if (values.imeis[i].imei.length > 0) {
          imeis.push(values.imeis[i].imei)
        }
        if(Object.keys(errors.imeis[i]).length === 0) {
            delete (errors.imeis[i]);
        }
        if(Object.keys(errors.imeis).length === 0) {
            delete (errors.imeis);
        }
        /*
        if (hasDuplicates(imeis)) {
          errors.duplicateImeis = 'Duplicate IMEIs found'
        }*/
      }
    }

    if (!values.brand) {
        errors.brand = 'This field is Required'
    } else if(!/^([a-zA-Z])([a-zA-Z 0-9.'_-])*$/i.test(values.brand)) {
      errors.brand = 'Brand must contain characters and a combination of [-._\']'
    } else if(values.brand.length >= 1000) {
      errors.brand = 'Brand must be 1000 characters or less'
    }
    if (!values.model_name) {
        errors.model_name = 'This field is Required'
    } else if(!/^([a-zA-Z])([a-zA-Z 0-9.'_-])*$/i.test(values.model_name)) {
      errors.model_name = 'Model Name must contain characters and a combination of [-._\']'
    } else if(values.model_name.length >= 1000) {
      errors.model_name = 'Model Name must be 1000 characters or less'
    }

    if (!values.serial_no) {
      errors.serial_no = 'This field is Required'
    } else if(!/^([a-zA-Z0-9])([a-zA-Z 0-9.'_-])*$/i.test(values.serial_no)) {
      errors.serial_no = 'Serial Number must contain characters and a combination of [-._\']'
    } else if(values.serial_no.length >= 1000) {
      errors.serial_no = 'Serial Number must be 1000 characters or less'
    }

    if (!values.retype_serial_no) {
      errors.retype_serial_no = 'This field is Required'
    } else if(values.serial_no !== values.retype_serial_no) {
      errors.retype_serial_no = 'Entered Serial Number doesn\'t match'
    }

    if(!values.mac) {

    } else if (!/^([0-9A-F]{2,4}[.:-]){3,7}([0-9A-F]{2,4})$/i.test(values.mac)) {
      errors.mac = 'Invalid format, valid formats are given in description'
    }

    if(values.mac !== values.retype_mac) {
      errors.retype_mac = 'Entered MAC Address doesn\'t match'
    }

    if (!values.technologies || !values.technologies.length) {
        errors.technologies = 'This field is Required'
    }

    if (!values.ref_msisdn) {
        errors.ref_msisdn = 'This field is Required'
    } else if (!/^([0-9]{1,11})$/i.test(values.ref_msisdn)) {
      errors.ref_msisdn = 'Invalid format, valid format is: 3001234567891'
    }

    return errors;
  },

  handleSubmit: (values, bag) => {
    bag.setSubmitting(false);
    bag.props.callServer(prepareAPIRequest(values));
  },

  displayName: 'CaseForm', // helps with React DevTools
})(CaseForm);

function prepareAPIRequest(values) {
   // Validate Values before sending
    const searchParams = {};
    if(values.ref_msisdn) {
        searchParams.CONTACT = {}
        searchParams.CONTACT.CC = COUNTRY_CODE;
        searchParams.CONTACT.SN = values.ref_msisdn;
    }
    if(values.model_name) {
        searchParams.MODEL = values.model_name;
    }
    if(values.brand) {
        searchParams.BRAND = values.brand;
    }
    if(values.serial_no) {
        searchParams.Serial_No = values.serial_no;
    }
    if(values.mac) {
        searchParams.MAC = values.mac;
    } else {
        searchParams.MAC = ''
    }
    if(values.technologies) {
        searchParams.RAT = [];
        for (let i=0; i< values.technologies.length; i++) {
          searchParams.RAT[i] = values.technologies[i].value;
        }
        searchParams.RAT = searchParams.RAT.join(',');
    }
    if(values.imeis.length > 0) {
        searchParams.IMEI = [];
        for (let i = 0; i < values.imeis.length; i++) {
          searchParams.IMEI[i] = values.imeis[i].imei
        }
    }
    return searchParams;
}

class GeneratePairCode extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: null,
      loading: false,
      caseSubmitted: false
    }
    this.saveCase = this.saveCase.bind(this);
    this.updateTokenHOC = this.updateTokenHOC.bind(this);
  }

  updateTokenHOC(callingFunc, values = null) {
      let config = null;
      if(this.props.kc.isTokenExpired(0)) {
          this.props.kc.updateToken(0)
              .success(() => {
                  localStorage.setItem('token', this.props.kc.token)
                  config = {
                    headers: getAuthHeader(this.props.kc.token)
                  }
                  callingFunc(config, values);
              })
              .error(() => this.props.kc.logout());
      } else {
          config = {
            headers: getAuthHeader()
          }
          callingFunc(config, values);
      }
  }

  saveCase(config, values) {
    instance.post('/sbmt-dev-info', values, config)
          .then(response => {
              if(response.data) {
                this.setState({ loading: false, caseSubmitted: true });
                //toast.success('Case has been registered successfully!');
                const statusDetails = {
                  id: response.data.pair_code,
                  icon: 'fa fa-check',
                  action: 'Registered',
                  showButton: false,
                  link: null
                }
                this.props.history.push({
                  pathname: '/request-status',
                  state: {details: statusDetails}
                });
              } else {
                toast.error('something went wrong');
              }
          })
          .catch(error => {
              errors(this, error);
          })
  }

  render() {
    return (
        <I18n ns="translations">
        {
          (t, { i18n }) => (
            <div>
              <MyEnhancedForm callServer={(values) => this.updateTokenHOC(this.saveCase, values)} caseSubmitted={this.state.caseSubmitted}/>
            </div>
          )
        }
        </I18n>
    )
  }
}

export default translate('translations')(GeneratePairCode);
