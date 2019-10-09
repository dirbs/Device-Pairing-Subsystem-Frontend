/*
Copyright (c) 2018-2019 Qualcomm Technologies, Inc.
All rights reserved.
Redistribution and use in source and binary forms, with or without modification, are permitted (subject to the limitations in the 
disclaimer below) provided that the following conditions are met:
    * Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
    * Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer 
      in the documentation and/or other materials provided with the distribution.
    * Neither the name of Qualcomm Technologies, Inc. nor the names of its contributors may be used to endorse or promote 
      products derived from this software without specific prior written permission.
    * The origin of this software must not be misrepresented; you must not claim that you wrote the original software. If you use 
      this software in a product, an acknowledgment is required by displaying the trademark/log as per the details provided 
      here: https://www.qualcomm.com/documents/dirbs-logo-and-brand-guidelines
    * Altered source versions must be plainly marked as such, and must not be misrepresented as being the original software.
    * This notice may not be removed or altered from any source distribution.
NO EXPRESS OR IMPLIED LICENSES TO ANY PARTY'S PATENT RIGHTS ARE GRANTED BY THIS LICENSE. THIS SOFTWARE IS PROVIDED 
BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT 
LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO 
EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, 
EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; 
LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN 
CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS 
SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/

import React, {Component} from 'react';
import {translate} from 'react-i18next';
import {Row, Col, Button, Form, Card, CardHeader, CardBody} from 'reactstrap';
import {withFormik, Field, FieldArray} from 'formik';
import {errors, instance, getAuthHeader, languageCheck} from "../../utilities/helpers";
import doubleEntryInput from '../../components/Form/DoubleEntryInput'
import renderInput from '../../components/Form/RenderInput'
import RenderSelect from '../../components/Form/RenderSelect'
import {COUNTRY_CODE} from '../../utilities/constants'
import {toast} from 'react-toastify';
import i18n from 'i18next';

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
              <div className="alert alert-info mb-2"><b>{i18n.t('deviceImeiS')}:</b>
                <ul>
                  <li>{i18n.t('IMEIDeviceInfoOne')}
                  </li>
                  <li>{i18n.t('IMEIDeviceInfoTwo')}</li>
                </ul>
              </div>
              <div className="alert alert-info"><b> {i18n.t('macWiFiAddress')}:</b>
                <ul>
                  <li>{i18n.t('MACInfoOne')}:
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
              <CardHeader><b>{i18n.t('deviceImeiS')}</b></CardHeader>
              <CardBody>
                <div className="add-remove-wrap position-relative">
                  <FieldArray
                    name="imeis"
                    render={({insert, remove, push}) => {
                      return (
                        <div>
                          {values.imeis && values.imeis.length > 0 && values.imeis.map((imei, i) => {
                            let inputClass = errorClass(errors, touched, i);
                            let reInputClass = errorClass(errors, touched, i);
                            return (
                              <Row key={i} className="mt-3">
                                <Col xs={6}>
                                  <Field name={`imeis[${i}].imei`} component={doubleEntryInput} label={i18n.t('typeImei')}
                                         type="text" placeholder={i18n.t('typeImei') + ' ' + (i + 1)} requiredStar groupClass="mb-0"
                                         inputClass={inputClass}/>
                                  {errors &&
                                  errors.imeis &&
                                  errors.imeis[i] &&
                                  errors.imeis[i]['imei'] &&
                                  touched &&
                                  touched.imeis &&
                                  touched.imeis[i] &&
                                  touched.imeis[i]['imei'] &&
                                  (
                                    <span className="invalid-feedback p-0"
                                          style={{display: 'block'}}>{errors.imeis[i]['imei']}</span>
                                  )}
                                </Col>
                                <Col xs={6}>
                                  <div className="buttonbox">
                                    <Field name={`imeis[${i}].reImei`} component={doubleEntryInput} label={i18n.t('retypeImei')}
                                           type="text" placeholder={i18n.t('retypeImei') + ' ' + (i + 1)} requiredStar
                                           groupClass="mb-0" inputClass={reInputClass}/>
                                    {errors &&
                                    errors.imeis &&
                                    errors.imeis[i] &&
                                    errors.imeis[i]['reImei'] &&
                                    touched &&
                                    touched.imeis &&
                                    touched.imeis[i] &&
                                    touched.imeis[i]['reImei'] &&
                                    (
                                      <span className="invalid-feedback p-0"
                                            style={{display: 'block'}}>{errors.imeis[i]['reImei']}</span>
                                    )}
                                    {i !== 0 && <button
                                      type="button"
                                      className="button button-remove"
                                      onClick={() => remove(i)}
                                    ></button>}
                                  </div>
                                </Col>
                              </Row>
                            )
                          })}
                          <Button
                            type="button"
                            className={values.imeis.length >= 5 ? 'btn btn-outline-primary mt-3 d-none text-capitalize' : 'btn btn-outline-primary mt-3 text-capitalize'}
                            onClick={() => push({imei: "", reImei: ""})}
                            disabled={values.imeis.length >= 5}
                          >
                              {i18n.t('addImeIs')}
                          </Button>
                        </div>
                      )
                    }}
                  />
                </div>
              </CardBody>
            </Card>
            <Card>
              <CardHeader><b>{i18n.t('deviceIdentifiers')}</b></CardHeader>
              <CardBody>

                <Row>
                  <Col xs={12} sm={6}>
                    <Field name="serial_no" component={doubleEntryInput} label={i18n.t('serialNumber')} type="text"
                           placeholder={i18n.t('serialNumber')} requiredStar maxLength={1000}/>
                  </Col>
                  <Col xs={12} sm={6}>
                    <Field name="retype_serial_no" component={doubleEntryInput} label={i18n.t('retypeSerialNumber')} type="text"
                           placeholder={i18n.t('retypeSerialNumber')} requiredStar maxLength={1000}/>
                  </Col>
                </Row>

                <Row>
                  <Col xs={12} sm={6}>
                    <Field name="brand" component={renderInput} label={i18n.t('brand')} type="text" placeholder={i18n.t('brand')}
                           requiredStar/>
                  </Col>
                  <Col xs={12} sm={6}>
                    <Field name="model_name" component={renderInput} label={i18n.t('modelName')} type="text"
                           placeholder={i18n.t('modelName')} requiredStar/>
                  </Col>
                </Row>

                <Row>
                  <Col xs={12} sm={6}>
                    <Field name="mac" component={doubleEntryInput} label={i18n.t('macWiFiAddress')} type="text"
                           placeholder={i18n.t('macWiFiAddress')} maxLength={23}/>
                  </Col>
                  <Col xs={12} sm={6}>
                    <Field name="retype_mac" component={doubleEntryInput} label={i18n.t('retypeMacWiFiAddress')} type="text"
                           placeholder={i18n.t('retypeMacWiFiAddress')} maxLength={23}/>
                  </Col>
                </Row>

                <Row>
                  <Col xs={12} sm={6}>
                    <RenderSelect
                      value={values.technologies}
                      onChange={setFieldValue}
                      options={[{label: '2G', value: '2G'}, {label: '3G', value: '3G'}, {
                        label: '4G',
                        value: '4G'
                      }, {label: '5G', value: '5G'}]}
                      onBlur={setFieldTouched}
                      error={errors.technologies}
                      touched={touched.technologies}
                      fieldName="technologies"
                      label={i18n.t('radioAccessTechnologies')}
                      placeholder={i18n.t('selectTechnologies')}
                      requiredStar
                      stayOpen={true}
                      multi={true}
                    />
                  </Col>
                  <Col xs={12} sm={6}>
                    <Field name="ref_msisdn" component={renderInput} label={i18n.t('referenceMsisdn')} type="text"
                           placeholder={i18n.t('referenceMsisdn')} requiredStar maxLength={15} groupClass="prefix-group"
                           prefix={COUNTRY_CODE}/>
                  </Col>
                </Row>

              </CardBody>
            </Card>
            <div className="text-right">
              <Button color="primary" type="submit" className="btn-next-prev" disabled={isSubmitting}
                      role="button">{i18n.t('submit')}</Button>
            </div>
          </Col>
        </Row>
      </Form>
    );
  }
}

const MyEnhancedForm = withFormik({
  mapPropsToValues: () => ({
    "imeis": [{imei: '', reImei: ''}],
    "serial_no": "",
    "retype_serial_no": "",
    "brand": "",
    "model_name": "",
    "mac": "",
    "retype_mac": "",
    "technologies": [],
    "ref_msisdn": ""
  }),

  // Custom sync validation
  validate: values => {
    let errors = {};
    let imeis = [];
    if (values.imeis.length > 0) {
      for (let i = 0; i < values.imeis.length; i++) {
        if (typeof errors.imeis === "undefined") {
          errors.imeis = [];
        }
        if (typeof errors.imeis[i] === "undefined") {
          errors.imeis[i] = {};
        }


        if (!values.imeis[i].imei) {
          errors.imeis[i].imei = i18n.t('validation.thisFieldIsRequired')
        } else if (!/^(?=.[A-F]*)(?=.[0-9]*)[A-F0-9]{14,16}$/.test(values.imeis[i].imei)) {
          errors.imeis[i].imei = i18n.t('validation.imeiMustContain')
        }

        if (!values.imeis[i].reImei) {
          errors.imeis[i].reImei = i18n.t('validation.thisFieldIsRequired')
        } else if (!/^(?=.[A-F]*)(?=.[0-9]*)[A-F0-9]{14,16}$/.test(values.imeis[i].reImei)) {
          errors.imeis[i].reImei = i18n.t('validation.imeiMustContain')
        } else if (values.imeis[i].imei !== values.imeis[i].reImei) {
          errors.imeis[i].reImei = i18n.t('validation.enteredImeiDoesnTMatch')
        }
        if (values.imeis[i].imei.length > 0) {
          imeis.push(values.imeis[i].imei)
        }
        if (Object.keys(errors.imeis[i]).length === 0) {
          delete (errors.imeis[i]);
        }
        if (Object.keys(errors.imeis).length === 0) {
          delete (errors.imeis);
        }
        /*
        if (hasDuplicates(imeis)) {
          errors.duplicateImeis = 'Duplicate IMEIs found'
        }*/
      }
    }

    if (!values.brand) {
      errors.brand = i18n.t('validation.thisFieldIsRequired')
    }else if (languageCheck(values.brand) === false && !/[-& ]/g.test(values.brand)){
      errors.brand = i18n.t('validation.langError')
    }
    else if (!/^([a-zA-Z &-])([a-zA-Z 0-9 &-])*$/i.test(values.brand)) {
      errors.brand = i18n.t('validation.brandMustContainCharactersAndACombinationOf')
    } else if (values.brand.length >= 1000) {
      errors.brand = i18n.t('validation.brandMustBe1000CharactersOrLess')
    }
    if (!values.model_name) {
      errors.model_name = i18n.t('validation.thisFieldIsRequired')
    }else if (languageCheck(values.model_name) === false && !/[-() ]/g.test(values.model_name)){
      errors.model_name = i18n.t('validation.langError')
    }
    else if (!/^([a-zA-Z ()'-])([a-zA-Z 0-9 ()'-])*$/i.test(values.model_name) ) {
      errors.model_name = i18n.t('validation.modelNameMustContainCharactersAndACombinationOf')
    } else if (values.model_name.length >= 1000) {
      errors.model_name = i18n.t('validation.modelNameMustBe1000CharactersOrLess')
    }

    if (!values.serial_no) {
      errors.serial_no = i18n.t('validation.thisFieldIsRequired')
    } else if (!/^([a-zA-Z0-9])([a-zA-Z 0-9.'_-])*$/i.test(values.serial_no)) {
      errors.serial_no = i18n.t('validation.serialNumberMustContainCharactersAndACombinationOf')
    } else if (values.serial_no.length >= 1000) {
      errors.serial_no = i18n.t('validation.serialNumberMustBe1000CharactersOrLess')
    }

    if (!values.retype_serial_no) {
      errors.retype_serial_no = i18n.t('validation.thisFieldIsRequired')
    } else if (values.serial_no !== values.retype_serial_no) {
      errors.retype_serial_no = i18n.t('validation.enteredSerialNumberDoesnTMatch')
    }

    if (!values.mac) {

    } else if (!/^([0-9A-F]{2,4}[.:-]){3,7}([0-9A-F]{2,4})$/i.test(values.mac)) {
      errors.mac = i18n.t('validation.invalidFormatValidFormatsAreGivenInDescription')
    }

    if (values.mac !== values.retype_mac) {
      errors.retype_mac = i18n.t('validation.enteredMacAddressDoesnTMatch')
    }

    if (!values.technologies || !values.technologies.length) {
      errors.technologies = i18n.t('validation.thisFieldIsRequired')
    }

    if (!values.ref_msisdn) {
      errors.ref_msisdn = i18n.t('validation.thisFieldIsRequired')
    } else if (!/^([0-9]{1,11})$/i.test(values.ref_msisdn)) {
      errors.ref_msisdn = i18n.t('validation.invalidFormatValidFormatIs3001234567891')
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
  if (values.ref_msisdn) {
    searchParams.CONTACT = {}
    searchParams.CONTACT.CC = COUNTRY_CODE;
    searchParams.CONTACT.SN = values.ref_msisdn;
  }
  if (values.model_name) {
    searchParams.MODEL = values.model_name;
  }
  if (values.brand) {
    searchParams.BRAND = values.brand;
  }
  if (values.serial_no) {
    searchParams.Serial_No = values.serial_no;
  }
  if (values.mac) {
    searchParams.MAC = values.mac;
  } else {
    searchParams.MAC = ''
  }
  if (values.technologies) {
    searchParams.RAT = [];
    for (let i = 0; i < values.technologies.length; i++) {
      searchParams.RAT[i] = values.technologies[i].value;
    }
    searchParams.RAT = searchParams.RAT.join(',');
  }
  if (values.imeis.length > 0) {
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
    if (this.props.kc.isTokenExpired(0)) {
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
        if (response.data) {
          this.setState({loading: false, caseSubmitted: true});
          //toast.success('Case has been registered successfully!');
          const statusDetails = {
            id: response.data.pair_code,
            icon: 'fa fa-check',
            action: i18n.t('registered'),
            showButton: false,
            link: null
          }
          this.props.history.push({
            pathname: '/request-status',
            state: {details: statusDetails}
          });
        } else {
          toast.error(i18n.t('wentWrong'));
        }
      })
      .catch(error => {
        errors(this, error);
        console.log(error);
      })
  }

  render() {
    return (
      <div>
        <MyEnhancedForm callServer={(values) => this.updateTokenHOC(this.saveCase, values)}
                        caseSubmitted={this.state.caseSubmitted}/>
      </div>
    )
  }
}

export default translate('translations')(GeneratePairCode);
