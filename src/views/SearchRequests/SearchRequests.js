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
import {Row, Col, Button, Form, FormGroup, Card, CardHeader, CardBody} from 'reactstrap';
import { withFormik, Field } from 'formik';
import renderInput from "./../../components/Form/RenderInput";
import {instance, errors, getAuthHeader } from "../../utilities/helpers";
import {PAGE_LIMIT} from '../../utilities/constants';
import TableLoader from './../../components/Loaders/TableLoader';
import Pagination from "react-js-pagination";
import DataTableInfo from '../../components/DataTable/DataTableInfo';

const SearchForm = props => {
  const {
    errors,
    isSubmitting,
    handleSubmit,
    handleReset,
    dirty,
  } = props;
  return (
    <Form onSubmit={handleSubmit}>
      <Card body outline className={errors['oneOfFields'] ? 'mb-2 border-danger': 'mb-2'}>
      <Row className="justify-content-end">
        <Col xs={12} sm={6} md={6} xl={3}>
          <Field name="imei" component={renderInput} type="text" label="IMEI" placeholder="IMEI"/>
        </Col>
        <Col xs={12} sm={6} md={6} xl={3}>
          <Field name="serial_no" component={renderInput} type="text" label="Serial Number"
                 placeholder="Serial Number"/>
        </Col>
        <Col xs={12} sm={6} md={6} xl={3}>
          <Field name="mac" component={renderInput} type="text" label="MAC Address" placeholder="MAC Address"/>
        </Col>
        <Col xs={12} sm={6} md={6} xl={3}>
          <Field name="contact" component={renderInput} type="text" label="Reference MSISDN"
                 placeholder="Reference MSISDN"/>
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
          <FormGroup>
            <Button color="default" onClick={handleReset} disabled={!dirty || isSubmitting} block>Clear Search</Button>
          </FormGroup>
        </Col>
        <Col xs={12} sm={6} md={6} xl={3}>
          <Button color="primary" type="submit" block disabled={isSubmitting}>Search Requests</Button>
        </Col>
      </Row>
    </Form>
  )
}

const MyEnhancedForm = withFormik({
  mapPropsToValues: () => ({ imei: '', serial_no: '', mac: '', contact: '' }),

  // Custom sync validation
  validate: values => {
      let errors = {};
      if (!values.imei && !values.serial_no && !values.mac && !values.contact) {
          errors.oneOfFields = 'One of the above fields is required'
      }
      return errors;
  },

  handleSubmit: (values, bag) => {
    bag.setSubmitting(false);
    bag.props.callServer(prepareAPIRequest(values));
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
      start: 1,
      limit: PAGE_LIMIT,
      data: null,
      loading: false,
      activePage: 1,
      totalCases: 0,
      searchQuery: {},
      apiFetched: false
    }
    this.getSearchRequestsFromServer = this.getSearchRequestsFromServer.bind(this);
    this.handlePageClick = this.handlePageClick.bind(this);
    this.saveSearchQuery = this.saveSearchQuery.bind(this);
    this.updateTokenHOC = this.updateTokenHOC.bind(this);
  }

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
    this.setState({ searchQuery: values, loading: true, data: null, apiFetched: true, start: 1, activePage: 1} , () => {
	  this.updateTokenHOC(this.getSearchRequestsFromServer);
	})
  }
  handlePageClick(page) {
    //let a1 = 1;
    //let d = this.state.limit;
   	//let start = a1 + d * (page - 1);

	this.setState({start: page, activePage: page, loading: true}, () => {
	  this.updateTokenHOC(this.getSearchRequestsFromServer);
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

  render() {
    let searched_requests = null;
    if(((this.state.data || {}).cases || []).length > 0) {
      searched_requests = this.state.data.cases.map((searched_request) => {
          return (
              <tr key={searched_request.pair_code}>
                  <td data-label="IMEIs">{searched_request.imei.split(',').join(', ')}</td>
                  <td data-label="Brand">{searched_request.brand}</td>
                  <td data-label="Model">{searched_request.model}</td>
                  <td data-label="Serial Number">{searched_request.serial_no}</td>
                  <td data-label="MAC Address">{searched_request.mac}</td>
                  <td data-label="Pairing Code">{searched_request.pair_code}</td>
                  <td data-label="Reference MSISDN">{searched_request.contact}</td>
                  <td data-label="Pairing Status">{(searched_request.is_active) ? 'Unused': 'Used'}</td>
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
                    <b>Search Filters</b>
                  </CardHeader>
                  <CardBody>
                    <MyEnhancedForm callServer={this.saveSearchQuery}/>
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
                                <b className="text-primary">{(this.state.totalCases > 1) ? `${this.state.totalCases} Requests found`: `${this.state.totalCases} Request found`}</b>
                            </CardHeader>
                        </Card>
                        <table className="table table-sm table-bordered table-hover mt-3 table-mobile-primary table-search">
                            <thead className="thead-light">
                                <tr>
                                    <th>IMEIs</th>
                                    <th>Brand</th>
                                    <th>Model</th>
                                    <th>Serial Number</th>
                                    <th>MAC Address</th>
                                    <th>Pairing Code</th>
                                    <th>Reference MSISDN</th>
                                    <th>Pairing Status</th>
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
                                <b className="text-danger">No Requests Found</b>
                            </CardHeader>
                        </Card>
                        : null
              }
              </ul>
              {(!this.state.loading && (((this.state.data || {}).cases || []).length > 0 && this.state.totalCases > PAGE_LIMIT) &&
              <Row>
                <Col xs={12} lg={6}>
                  <DataTableInfo start={this.state.start} limit={this.state.limit} total={this.state.totalCases} itemType={'requests'}/>
                </Col>
                <Col xs={12} lg={6}>
                  <Pagination
                    pageRangeDisplayed={window.matchMedia("(max-width: 767px)").matches ? 4 : 10}
                    activePage={this.state.activePage}
                    itemsCountPerPage={this.state.limit}
                    totalItemsCount={this.state.totalCases}
                    onChange={this.handlePageClick}
                    innerClass="pagination float-right"
                  />
                </Col>
              </Row>) || <div className="mb-3"></div>}
            </div>
          )
        }
        </I18n>
    )
  }
}

export default translate('translations')(SearchRequests);
