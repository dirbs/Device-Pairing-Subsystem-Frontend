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
import i18n from 'i18next';
import {instance, errors, getAuthHeader, getUserRole, SweetAlert} from "../../utilities/helpers";
import {PAGE_LIMIT,ITEMS_PER_PAGE} from "../../utilities/constants";
import Pagination from "react-js-pagination";
import FileSaver from "file-saver";
import {Row, Col, Button, Form, ModalHeader, ModalBody, ModalFooter,Input,Label} from 'reactstrap';
import renderInput from '../../components/Form/RenderInput';
import {withFormik, Field} from 'formik';
import RenderModal from '../../components/Form/RenderModal'
import StepLoading from "../../components/Loaders/StepLoading";
import {toast} from "react-toastify";
import DataTableInfo from '../../components/DataTable/DataTableInfo'
import 'react-select/dist/react-select.css';
/**
 * React Modal Component
 * Double entry input form to add IMSI
 * Props: mno,enable,selectedMsisdn
 * Props functions: closeModal, fetchData
 */
class AddIMSIForm extends Component {
  /**
   * Close Modal and Reset fields
   */
  closeModal() {
    this.props.closeModal()
    /**
     * Reset Formik Fields
     */
    this.props.handleReset()
  }

  render() {
    /**
     * Props
     */
    const {
      handleSubmit,
      enable,
      selectedMsisdn
    } = this.props
    return (
      <I18n ns="translations">
        {
          (t, {i18n}) => (
            <div>
              <RenderModal show={enable} className="modal-xl">
                <ModalHeader>{t('requests.addImsiFor')} {selectedMsisdn}</ModalHeader>
                <div className="steps-loading">
                  <Form onSubmit={handleSubmit}>
                    <ModalBody>
                      <Row>
                        <Col className='order-md-1' xs={12} md={6} lg={6}>
                          <Field name="imsi" component={renderInput} type="text" maxLength={15}
                                 label={t('modal.imsilabel')} placeholder={t('modal.imsiplaceholder')}/>
                        </Col>
                        <Col className='order-md-1' xs={12} md={6} lg={6}>
                          <Field name="reImsi" component={renderInput} type="text" maxLength={15}
                                 label={t('modal.reimsilabel')} placeholder={t('modal.reimsiplaceholder')}/>
                        </Col>
                      </Row>
                    </ModalBody>
                    <ModalFooter>
                      <Button className='eq-width' color="secondary" type="button" onClick={() => {
                        this.closeModal()
                      }}>{t('modal.close')}</Button>
                      <Button className='eq-width' color="primary" type="submit">{t('modal.add')}</Button>
                    </ModalFooter>
                  </Form>
                </div>
              </RenderModal>
            </div>
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
export const EnhancedModalForm = withFormik({
  mapPropsToValues: () => ({
    imsi: '',
    reImsi: ''
  }),
  /**
   * Formik validations
   * @param values
   */
  validate: values => {
    let errors = {}
    if (values.imsi === '') {
      errors.imsi = i18n.t('validation.thisFieldIsRequired')
    } else if (isNaN(values.imsi)) {
      errors.imsi = i18n.t('validation.IMSIMustbeDigits')
    } else if (values.imsi.length < 15) {
      errors.imsi = i18n.t('validation.IMSIShouldbeLessThan')
    }
    if (values.reImsi === '') {
      errors.reImsi = i18n.t('validation.thisFieldIsRequired')
    } else if (values.imsi !== values.reImsi) {
      errors.reImsi = i18n.t('validation.IMSIDoesNotMatch')
    }
    return errors;
  },
  /**
   * Formik submit function
   * @param values
   * @param bag
   */
  handleSubmit: (values, bag) => {
    let data = {
      "mno": bag.props.mno,
      "MSISDN": {
        "CC": bag.props.countryCode,
        "SN": bag.props.selectedMsisdn.substr(bag.props.countryCode.length)
      },
      "IMSI": values.imsi
    }
    /**
     * Add single MNO API call
     */
    bag.props.addSingleIMSI(data)
    if (values.imsi || values.reImsi) {
      values.imsi = values.reImsi = '';
    }
  },
  displayName: 'AddIMSIForm', // helps with React DevTools
})(AddIMSIForm);

/**
 * React Container Component
 * Fetch data, Handle state
 */
class Requests extends Component {
  constructor(props) {
    super(props)
    this.state = {
      mno: '',
      start: 0,
      prevStart: null,
      limit: PAGE_LIMIT,
      activePage: 1,
      loading: false,
      totalCases: null,
      enableModal: false,
      selectedMsisdn: null,
      countryCode: null,
      data: null,
      options: ITEMS_PER_PAGE
    }
    this.handlePageClick = this.handlePageClick.bind(this);
    this.getCases = this.getCases.bind(this);
    this.downloadRequests = this.downloadRequests.bind(this);
    this.toggleModal = this.toggleModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.updateTokenHOC = this.updateTokenHOC.bind(this);
    this.addSingleIMSI = this.addSingleIMSI.bind(this);
    this.handleLimitChange = this.handleLimitChange.bind(this);
    this.handlePagination = this.handlePagination.bind(this);
  }

  isBottom(el) {
    return el.getBoundingClientRect().bottom - 100 <= window.innerHeight;
  }

  componentWillUnmount() {
    document.removeEventListener('scroll', this.handlePagination);
  }

  handlePagination = () => {
    const wrappedElement = document.getElementById('root');
    if (this.isBottom(wrappedElement)) {
      document.body.classList.remove('pagination-fixed');
    } else {
      document.body.classList.add('pagination-fixed');
    }
  };

  /**
   * HOC function to update token
   * @param callingFunc
   */
  updateTokenHOC(callingFunc, param = null) {
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

  /**
   * Pagination function
   * @param page
   */
  handlePageClick(page) {
    let a1 = 1;
    let d = this.state.limit;
    // -1 at the end indicates that start should be always 0 for first page
   	let start = a1 + d * (page - 1) - 1;

    this.setState({start: start, activePage: page, loading: true}, () => {
      this.updateTokenHOC(this.getCases)
    });
  }

  /**
   * Get Requests App call
   */
  getCases(config) {
    this.setState({
      loading: true
    })
    instance.get(`mno-first-page?mno=${this.state.mno}&start=${this.state.start}&limit=${this.state.limit}`, config)
      .then(response => {
        this.setState({
          data: response.data.cases,
          totalCases: response.data.count,
          countryCode: response.data.country_code,
          loading: false
        },()=>{
          let options = []
          if(this.state.totalCases === 10){
            options = this.state.options.filter((el)=>{
              return el.value===10
            })
            this.setState({options})
          } else if (this.state.totalCases > 10 && this.state.totalCases <= 20) {
            options = this.state.options.filter((el)=>{
              return el.value<=20
            })
            this.setState({options})
          } else if(this.state.totalCases > 20 && this.state.totalCases <= 30){
            options = this.state.options.filter((el)=>{
              return el.value<=20
            })
            this.setState({options})
          } else if(this.state.totalCases > 30 && this.state.totalCases <= 50){
            options = this.state.options.filter((el)=>{
              return el.value<=50
            })
            this.setState({options})
          } else if(this.state.totalCases > 50 && this.state.totalCases <= 100){
            options = this.state.options.filter((el)=>{
              return el.value<=100
            })
            this.setState({options})
          }
        });
      })
      .catch(error => {
        this.setState({
          loading: false
        })
        errors(this, error);
      })
  }

  /**
   * Bulk download IMSI Requests
   * @param e
   */
  downloadRequests(config, e) {
    e.preventDefault()
    let mno = this.state.mno
    instance.get(`mno-bulk-download?mno=${mno}`, config)
      .then(response => {
        if (response.status === 200) {
          try {
            let blob = new Blob([response.data], {type: "text/csv;"});
            FileSaver.saveAs(blob, "Request-Document.csv");
          } catch (err) {
            let file = new Blob([response.data], {type: "text/csv;"});
            window.navigator.msSaveBlob(file, "Request-Document.csv");
          }
        }
      })
      .catch(error => {
        errors(this, error);
      })
  }

  /**
   * Toggle Modal dialog
   * @param cases
   * @param e
   */
  toggleModal(cases, e) {
    e.preventDefault()
    this.setState({
      selectedMsisdn: cases.MSISDN
    }, () => {
      this.setState({
        enableModal: true
      })
    })
  }

  /**
   * Add Single IMSI
   * @param: config
   * @param: data
   */
  addSingleIMSI(config, data) {
    instance.put(`mno-single-upload`, data, config)
      .then(response => {
        if (response.status === 200) {
          this.closeModal()
          /**
           * fetch data from main component
           */
          this.updateTokenHOC(this.getCases)
          SweetAlert({
            title: i18n.t('success'),
            message: response.data.msg,
            type: 'success'
          })
        }
      })
      .catch(error => {
        errors(this, error);
      })
  }

  /**
   * Close Modal
   * Set trigger state
   */
  closeModal() {
    this.setState({
      enableModal: false
    })
  }

  componentWillMount() {
    this.setState({
      mno: getUserRole(this.props.resources)
    }, () => {
      this.updateTokenHOC(this.getCases)
    });
    document.addEventListener('scroll', this.handlePagination);
  }

  handleLimitChange = (e) => {
    e.preventDefault();
    let limit = parseInt(e.target.value);
    let currentPage = Math.ceil((this.state.start + 1) / limit);
    this.setState({limit:limit},()=>{
      this.handlePageClick(currentPage);
    });
  }

  render() {
    const {loading,options} = this.state
    const itemOptions = options.map((item)=>{
      return <option key={item.value} value={item.value}>{item.label}</option>
    })
    return (
      <I18n ns="translations">
        {
          (t) => (
            <div className="animated fadeIn steps-loading">
              {loading &&
              <StepLoading/>
              }
              <table className="table table-bordered table-add-imsi table-sm mb-0">
                <thead className="thead-light">
                <tr>
                  <th>{t('requests.id')}</th>
                  <th>MSISDN</th>
                  <th>{t('requests.actions')}</th>
                </tr>
                </thead>
                <tbody>
                {(this.state.data && this.state.data.map((cases, i) => {
                  return <tr key={i}>
                    <td>{cases.Req_id}</td>
                    <td>{cases.MSISDN}</td>
                    <td>
                      <button className="btn btn-link btn-sm" onClick={(e) => {
                        this.toggleModal(cases, e)
                      }}>{t('requests.addImsi')}</button>
                    </td>
                  </tr>
                })) || <tr>
                  <td className="text-center" colSpan={3}>{t('noRequestFound')}</td>
                </tr>
                }
                </tbody>
              </table>
              <EnhancedModalForm
                mno={this.state.mno}
                enable={this.state.enableModal}
                selectedMsisdn={this.state.selectedMsisdn}
                countryCode={this.state.countryCode}
                closeModal={this.closeModal}
                addSingleIMSI={(data) => this.updateTokenHOC(this.addSingleIMSI, data)}
              />
              <div className="react-bs-table-pagination">
                {this.state.data &&
                  <p>
                    <button className="btn btn-link"
                            onClick={(e) => this.updateTokenHOC(this.downloadRequests, e)}>{t('requests.downloadDocuments')}</button>
                  </p>
                }
              </div>
              {(!loading && this.state.totalCases >= PAGE_LIMIT) &&
                <article className='data-footer'>
                  <Pagination
                    pageRangeDisplayed={window.matchMedia("(max-width: 767px)").matches ? 4 : 10}
                    activePage={this.state.activePage}
                    itemsCountPerPage={this.state.limit}
                    totalItemsCount={this.state.totalCases}
                    onChange={this.handlePageClick}
                    innerClass="pagination"
                  />
                  <div className="hand-limit">
                    <Label>{t('show')}</Label>
                    <div className="selectbox">
                      <Input value={this.state.limit} onChange={(e) => {
                        this.handleLimitChange(e)
                      }}
                             type="select" name="select">
                        {itemOptions}
                      </Input>
                    </div>
                    <Label>{t('requests')}</Label>
                  </div>
                  <div className='start-toend'>
                    <DataTableInfo start={this.state.start} limit={this.state.limit} total={this.state.totalCases}
                                   itemType={t('requests')}/>
                  </div>
                </article>
              }
            </div>
          )
        }
      </I18n>
    )
  }
}

export default translate('translations')(Requests);
