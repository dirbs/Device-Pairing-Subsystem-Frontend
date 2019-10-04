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
import {translate, I18n} from 'react-i18next';
import {getExtension, getAuthHeader, errors, instance, getUserRole} from "../../utilities/helpers";
import {Card, CardBody, CardHeader, Form} from "reactstrap";
import {withFormik} from "formik";
import RenderFileInput from "../../components/Form/RenderFileInput";
import StepLoading from "../../components/Loaders/StepLoading";
import i18n from 'i18next';

/**
 * Formik form component
 * Props: loading
 * Props: handleSubmit
 */
class FileInputForm extends Component {
  render() {
    const {
      setFieldValue,
      setFieldTouched,
      errors,
      values,
      handleSubmit,
      loading
    } = this.props
    return (
      <I18n ns="translations">
        {
          (t, {i18n}) => (
            <Form onSubmit={handleSubmit}>
              <div className="row">
                <div className="col-xl-8">
                  <Card>
                    <CardHeader><b>{t('uploadDocument')}</b></CardHeader>
                    <CardBody className='steps-loading'>
                      {loading &&
                      <StepLoading/>
                      }
                      <div className="row">
                        <div className="col-xs-12 col-sm-6">
                          <RenderFileInput
                            onChange={setFieldValue}
                            acceptFormats=".csv"
                            onBlur={setFieldTouched}
                            error={errors.file}
                            values={values.file}
                            fieldName="file"
                            type="file"
                            inputClass="asitfield"
                            label={t('selectIMSIfile')}
                            requiredStar
                          />
                        </div>
                      </div>
                    </CardBody>
                  </Card>
                  <div className="text-right">
                    <div className="form-group">
                      <button type="submit" className="btn btn-primary btn-next-prev">
                        {t('submit')}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </Form>
          )
        }
      </I18n>
    )
  }
}

/**
 * Formik HOC
 * @type {React.ComponentType<any>}
 */
export const EnhancedFileForm = withFormik({
  mapPropsToValues: () => ({
    file: ""
  }),
  /**
   * Validations
   * @param values
   */
  validate: values => {
    let errors = {}
    if (!values.file) {
      errors.file = i18n.t('validation.thisFieldIsRequired')
    } else if (getExtension(values.file.name) !== 'csv') {
      errors.file = i18n.t('validation.invalideFileExtension')
    } else if (values.file.size > 5000000) {
      errors.file = i18n.t('validation.fileSize')
    }
    return errors;
  },
  /**
   * Formik submit function
   * @param values
   * @param bag
   */
  handleSubmit: (values, bag) => {
    /**
     * Prepare form Data
     * @type {FormData}
     */
    const formData = new FormData();
    formData.append('mno', bag.props.mno);
    formData.append('file', values.file);
    bag.props.bulkUpload(formData)
  },
  displayName: 'FileInputForm', // helps with React DevTools
})(FileInputForm);

class BulkUpload extends Component {
  constructor(props) {
    super(props)
    this.state = {
      mno: '',
      loading: false
    }
    this.setLoading = this.setLoading.bind(this);
    this.redirect = this.redirect.bind(this);
    this.bulkUpload = this.bulkUpload.bind(this);
    this.updateTokenHOC = this.updateTokenHOC.bind(this);
  }
  /**
   * HOC function to update token
   * @param callingFunc
   */
  updateTokenHOC(callingFunc, param=null) {
    let config = null;
    if (this.props.kc.isTokenExpired(0)) {
      this.props.kc.updateToken(0)
        .success(() => {
          localStorage.setItem('token', this.props.kc.token)
          config = {
            headers: getAuthHeader(this.props.kc.token)
          }
          callingFunc(config, param);
        })
        .error(() => this.props.kc.logout());
    } else {
      config = {
        headers: getAuthHeader()
      }
      callingFunc(config, param);
    }
  }
  bulkUpload(config,formData){
    this.setLoading(true)
    instance.post(`mno-bulk-upload`, formData, config)
      .then(response => {
        if (response.status === 200) {
          this.setLoading(false)
          const statusDetails = {
            icon: 'fa fa-check',
            response: response.data,
          }
          this.redirect(statusDetails)
        }
      })
      .catch(error => {
        errors(this, error);
        this.setLoading(false)
      })
  }
  setLoading(val) {
    this.setState({
      loading: val
    })
  }
  redirect(statusDetails){
    this.props.history.push({
      pathname: '/bulk-status',
      state: {details: statusDetails}
    });
  }
  componentDidMount() {
    this.setState({
      mno: getUserRole(this.props.resources)
    })
  }

  render() {
    return (
      <div className="animated fadeIn">
        <EnhancedFileForm mno={this.state.mno}
                          loading={this.state.loading}
                          bulkUpload={(formData)=>this.updateTokenHOC(this.bulkUpload,formData)}
        />
      </div>
    )
  }
}

export default translate('translations')(BulkUpload);
