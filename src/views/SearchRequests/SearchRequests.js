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

import React, { Component } from 'react';
import { translate, I18n } from 'react-i18next';
import {Row, Col, Button, Form, Card, CardHeader, CardBody, Label, Input} from 'reactstrap';
import { withFormik, Field } from 'formik';
import renderInput from "./../../components/Form/RenderInput";
import {instance, errors, getAuthHeader } from "../../utilities/helpers";
import {ITEMS_PER_PAGE, PAGE_LIMIT} from '../../utilities/constants';
import TableLoader from './../../components/Loaders/TableLoader';
import Pagination from "react-js-pagination";
import DataTableInfo from '../../components/DataTable/DataTableInfo';
import SearchFilters from "./SearchFilters";
import i18n from "i18next";

class SearchForm extends Component {
  constructor(props) {
    super(props);
    this.handleResetForm = this.handleResetForm.bind(this);
    this.handleReset = this.handleReset.bind(this);
  }
  handleReset(e,val) {
    e.preventDefault()
    switch(val){
      case 'IMEI':
        this.props.setFieldValue('imei','')
        this.props.delSearchQuery(this.props.currSearchQuery,val)
        break;
      case 'Serial_No':
        this.props.setFieldValue('serial_no','')
        this.props.delSearchQuery(this.props.currSearchQuery,val)
        break;
      case 'MAC':
        this.props.setFieldValue('mac','')
        this.props.delSearchQuery(this.props.currSearchQuery,val)
        break;
      case 'CONTACT':
        this.props.setFieldValue('contact','')
        this.props.delSearchQuery(this.props.currSearchQuery,val)
        break;
      default:
        break;
    }
  }
  handleResetForm(){
    this.props.resetForm()
    this.props.delSearchQuery(this.props.currSearchQuery,'all')
  }
  render() {
    const {
      errors,
      isSubmitting,
      handleSubmit,
      dirty,
      currSearchQuery
    } = this.props;

    return(
      <Form onSubmit={handleSubmit}>
        {(currSearchQuery.length > 0) && <div>
          <div className='selected-filters-header'>
            <Button color="link" onClick={() => { this.handleResetForm(); }} disabled={!dirty || isSubmitting}>{i18n.t('clearAll')}</Button>
          </div>
          <SearchFilters filters={currSearchQuery} handleReset={this.handleReset} />
          <hr />
        </div>}

        <Card body outline className={errors['oneOfFields'] ? 'mb-2 border-danger': 'mb-2'}>
        <Row className="justify-content-end">
          <Col xs={12} sm={6} md={6} xl={3}>
            <Field name="imei" component={renderInput} type="text" label="IMEI" placeholder="IMEI"/>
          </Col>
          <Col xs={12} sm={6} md={6} xl={3}>
            <Field name="serial_no" component={renderInput} type="text" label={i18n.t('serialNumber')}
                   placeholder={i18n.t('serialNumber')}/>
          </Col>
          <Col xs={12} sm={6} md={6} xl={3}>
            <Field name="mac" component={renderInput} type="text" label={i18n.t('macAddress')} placeholder={i18n.t('macAddress')}/>
          </Col>
          <Col xs={12} sm={6} md={6} xl={3}>
            <Field name="contact" component={renderInput} type="text" label={i18n.t('referenceMsisdn')}
                   placeholder={i18n.t('referenceMsisdn')}/>
          </Col>
        </Row>
        </Card>
        <Field name="oneOfFields" render={({
          field, // { name, value, onChange, onBlur }
          form: { touched, errors }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
          ...props
        }) => (
            <div> {errors['oneOfFields'] && <span className="invalid-feedback" style={{display: 'block'}}>* {errors[field.name]}</span>} </div>
        )} />
        <Row className="justify-content-end">
          <Col xs={12} sm={6} md={6} xl={3}>
            <Button color="primary" type="submit" block disabled={isSubmitting}>{i18n.t('searchRequestLink')}</Button>
          </Col>
        </Row>
      </Form>
    );
  }
}

const MyEnhancedForm = withFormik({
  mapPropsToValues: () => ({ imei: '', serial_no: '', mac: '', contact: '' }),

  // Custom sync validation
  validate: values => {
      let errors = {};
      if (!values.imei && !values.serial_no && !values.mac && !values.contact) {
          errors.oneOfFields = i18n.t('validation.oneOfTheAboveFieldsIsRequired')
      }
      return errors;
  },

  handleSubmit: (values, bag) => {
    bag.setSubmitting(false);
    bag.props.callServer(prepareAPIRequest(values));
    bag.props.searchQuery(prepareAPIRequest(values));
  },

  displayName: 'SearchForm', // helps with React DevTools
})(SearchForm);

function prepareAPIRequest(values) {
    // Validate Values before sending
    const searchParams = {};
    if(values.imei) {
        searchParams.IMEI = values.imei
    }
    if(values.serial_no) {
        searchParams.Serial_No = values.serial_no
    }
    if(values.mac) {
        searchParams.MAC = values.mac
    }
    if(values.contact) {
        searchParams.CONTACT = values.contact
    }
    return searchParams;
}

class SearchRequests extends Component {
  constructor(props) {
    super(props);
    this.state = {
      start: 0,
      limit: PAGE_LIMIT,
      data: null,
      loading: false,
      activePage: 1,
      totalCases: 0,
      searchQuery: {},
      apiFetched: false,
      currSearchQuery: [],
      options: ITEMS_PER_PAGE
    }
    this.getSearchRequestsFromServer = this.getSearchRequestsFromServer.bind(this);
    this.handlePageClick = this.handlePageClick.bind(this);
    this.saveSearchQuery = this.saveSearchQuery.bind(this);
    this.updateTokenHOC = this.updateTokenHOC.bind(this);
    this.setSearchQuery = this.setSearchQuery.bind(this);
    this.delSearchQuery = this.delSearchQuery.bind(this);
    this.handleLimitChange = this.handleLimitChange.bind(this);
    this.handlePagination = this.handlePagination.bind(this);
  }

	isBottom(el) {
		return el.getBoundingClientRect().bottom - 100 <= window.innerHeight;
	}

	componentDidMount() {
		document.addEventListener('scroll', this.handlePagination);
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

  updateTokenHOC(callingFunc) {
      let config = null;
      if(this.props.kc.isTokenExpired(0)) {
          this.props.kc.updateToken(0)
              .success(() => {
                  localStorage.setItem('token', this.props.kc.token)
                  config = {
                    headers: getAuthHeader(this.props.kc.token)
                  }
                  callingFunc(config);
              })
              .error(() => this.props.kc.logout());
      } else {
          config = {
            headers: getAuthHeader()
          }
          callingFunc(config);
      }
  }

  saveSearchQuery(values) {
    this.setState({ searchQuery: values, loading: true, data: null, apiFetched: true, start: 0, activePage: 1} , () => {
	  this.updateTokenHOC(this.getSearchRequestsFromServer);
	})
  }
  handlePageClick(page) {
    let a1 = 1;
    let d = this.state.limit;
    // -1 at the end indicates that start should be always 0 for first page
   	let start = a1 + d * (page - 1) - 1;

	this.setState({start: start, activePage: page, loading: true}, () => {
	  this.updateTokenHOC(this.getSearchRequestsFromServer);
	});
  }

  handleLimitChange = (e) => {
    e.preventDefault();
    let limit = parseInt(e.target.value);
    let currentPage = Math.ceil((this.state.start + 1) / limit);
    this.setState({limit:limit},()=>{
      this.handlePageClick(currentPage);
    });
  }

  getSearchRequestsFromServer(config) {
      let start = this.state.start;
      let limit = this.state.limit;
      let searchQuery = this.state.searchQuery;
      const postSearchData = {
        "start": start,
        "limit": limit,
        "search_args": searchQuery
      }
      instance.post('/authority-search?start='+start+'&limit='+limit, postSearchData, config)
          .then(response => {
              if(response.data.message) {
                this.setState({ loading: false });
              } else {
                this.setState({ data: null}, () => {
                  this.setState({ data: response.data, totalCases: (response.data || {}).count, loading: false});
                })
              }
          })
          .catch(error => {
              errors(this, error);
          })
  }
  setSearchQuery(values){
    let query = []
    Object.keys(values).map(key=>{
      //if(key!=='request_type'){
        switch(key){
          case 'IMEI':
            query.push({filter:key,filterName:'IMEI',value: values[key]})
            break;
          case 'Serial_No':
            query.push({filter:key,filterName:i18n.t('serialNumber'),value: values[key]})
            break;
          case 'MAC':
            query.push({filter:key,filterName:i18n.t('macAddress'),value: values[key]})
            break;
          case 'CONTACT':
            query.push({filter:key,filterName:i18n.t('referenceMsisdn'),value: values[key]})
            break;
           default:
            break;
        }
      //}
      return ''
    })
    this.setState({
      currSearchQuery: query
    })
  }
  delSearchQuery(filters,filter){
    let searchQuery = this.state.searchQuery;
    if(filter==='all'){
      this.setState({
        currSearchQuery: [],
        searchQuery:{}
      }, () => {
        this.updateTokenHOC(this.getSearchRequestsFromServer)
      })
    } else {
      let query = filters.filter((el)=>{
        return el.filter !== filter
      })
      delete searchQuery[filter];
      console.log(query);
      this.setState({
        searchQuery,
        currSearchQuery: query
      }, () => {
        if(query.length > 0) {
          this.updateTokenHOC(this.getSearchRequestsFromServer)
        }
      })
    }
  }

  render() {
    let searched_requests = null;
    const {options} = this.state
    const itemOptions = options.map((item)=>{
      return <option key={item.value} value={item.value}>{item.label}</option>
    })
    if(((this.state.data || {}).cases || []).length > 0) {
      searched_requests = this.state.data.cases.map((searched_request) => {
          return (
              <tr key={searched_request.pair_code}>
                  <td data-label="IMEIs">{searched_request.imei.split(',').join(', ')}</td>
                  <td data-label={i18n.t('brand')}>{searched_request.brand}</td>
                  <td data-label={i18n.t('modelName')}>{searched_request.model}</td>
                  <td data-label={i18n.t('serialNumber')}>{searched_request.serial_no}</td>
                  <td data-label={i18n.t('macAddress')}>{searched_request.mac}</td>
                  <td data-label={i18n.t('pairingCode')}>{searched_request.pair_code}</td>
                  <td data-label={i18n.t('referenceMsisdn')}>{searched_request.contact}</td>
                  <td data-label={i18n.t('pairingStatus')}>{(searched_request.is_active) ? 'Unused': 'Used'}</td>
              </tr>
          )
      });
    }
    return (
        <I18n ns="translations">
        {
          (t, { i18n }) => (
            <div className="search-box animated fadeIn">
              <div className="filters">
                <Card>
                  <CardHeader>
                    <b>{i18n.t('searchFilters')}</b>
                  </CardHeader>
                  <CardBody>
                    <MyEnhancedForm callServer={this.saveSearchQuery}
                    searchQuery={this.setSearchQuery} 
                    delSearchQuery={this.delSearchQuery} 
                    currSearchQuery={this.state.currSearchQuery}
                    handleResetFilters={this.handleReset}/>
                  </CardBody>
                </Card>
              </div>
              <ul className="listbox">
              {
                (this.state.loading)
                    ?
                    (
                        <div>
                            <TableLoader />
                        </div>
                    )
                    : ((this.state.data || {}).cases || []).length > 0
                    ? <div>
                        <Card className="mb-1">
                            <CardHeader className="border-bottom-0">
                                <b className="text-primary">{(this.state.totalCases > 1) ? `${this.state.totalCases} ${i18n.t('RequestFound')}`: `${this.state.totalCases} ${i18n.t('RequestFound')}`}</b>
                            </CardHeader>
                        </Card>
                        <table className="table table-sm table-bordered table-hover mt-3 table-mobile-primary table-search">
                            <thead className="thead-light">
                                <tr>
                                    <th>IMEIs</th>
                                    <th>{i18n.t('brand')}</th>
                                    <th>{i18n.t('modelName')}</th>
                                    <th>{i18n.t('serialNumber')}</th>
                                    <th>{i18n.t('macAddress')}</th>
                                    <th>{i18n.t('pairingCode')}</th>
                                    <th>{i18n.t('referenceMsisdn')}</th>
                                    <th>{i18n.t('pairingStatus')}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {searched_requests}
                            </tbody>
                        </table>
                      </div>
                    : (this.state.apiFetched)
                    ?
                        <Card className="mb-1">
                            <CardHeader className="border-bottom-0">
                                <b className="text-danger">{i18n.t('noRequestFound')}</b>
                            </CardHeader>
                        </Card>
                        : null
              }
              </ul>
	            {(((this.state.data || {}).cases || []).length > 0 && this.state.totalCases > PAGE_LIMIT && !(this.state.loading)) &&
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
				            <Label>{i18n.t('show')}</Label>
				            <div className="selectbox">
					            <Input value={this.state.limit} onChange={(e) => {
						            this.handleLimitChange(e)
					            }}
					                   type="select" name="select">
						            {itemOptions}
					            </Input>
				            </div>
				            <Label>{i18n.t('requests')}</Label>
			            </div>
			            <div className='start-toend'>
				            <DataTableInfo start={this.state.start} limit={this.state.limit} total={this.state.totalCases} itemType={'requests'}/>
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

export default translate('translations')(SearchRequests);
