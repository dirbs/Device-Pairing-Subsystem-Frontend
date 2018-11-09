import React, { Component } from 'react';
import {Link} from 'react-router-dom'
import i18n from './../../i18n';
import { translate, Trans, I18n } from 'react-i18next';
import { instance, errors, getAuthHeader } from "../../utilities/helpers";

class SearchCases extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: null,
      degdata: null,
      loading: false,
      apiFetched: false
    }
    this.getSearchRequestsFromServer = this.getSearchRequestsFromServer.bind(this);
  }

  componentDidMount() {
      this.getSearchRequestsFromServer();
  }

  getSearchRequestsFromServer() {
      var config = {
        headers: getAuthHeader()
      }
      instance.get('/registration', config)
          .then(response => {
              if(response.data) {
                this.setState({ data: response.data, loading: false});
              }
          })
          .catch(error => {
              errors(this, error);
          })

      instance.get('/deregistration', config)
          .then(response => {
              if(response.data) {
                this.setState({ regdata: response.data, loading: false});
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
            <div className="search-box animated fadeIn">
                <h3> Registration </h3>
              <ul className="listbox mb-4">
              {this.state.data && this.state.data.map((req, i) => {
                      if (req.status_label === 'New Request' || req.status_label === 'Awaiting Documents') {
                          return (<li key={req.id}><Link to={`/new-request/${req.id}`}><i className="fa fa-check"></i> Finish Registration # {req.id} -
                              Status: {req.status_label}</Link></li>)
                      } else {
                          return (<li key={req.id}>
                              <Link to={`/update-registration/${req.id}`}><i className="fa fa-pencil"></i> Update Registration # {req.id} -
                              Status: {req.status_label}</Link>
                              <Link to={`/review-registration/${req.id}/registration`} className="ml-3"><i className="fa fa-commenting-o"></i> Registration Review # {req.id} -
                              Status: {req.status_label}</Link>
                          </li>)
                      }
              })}
              </ul>
                <h3>De-registration</h3>
                <ul className="listbox">
              {this.state.regdata && this.state.regdata.map((req, i) => {
                      if (req.status_label === 'New Request' || req.status_label === 'Awaiting Documents') {
                          return (<li key={req.id}><Link to={`/de-registration/${req.id}`}><i className="fa fa-check"></i> Finish De-Registration # {req.id} -
                              Status: {req.status_label}</Link></li>)
                      } else {
                          return (<li key={req.id}>
                              <Link to={`/update-deregistration/${req.id}`}><i className="fa fa-pencil"></i> Update De-Registration # {req.id} -
                              Status: {req.status_label}</Link>
                              <Link to={`/review-deregistration/${req.id}/deregistration`} className="ml-3"><i className="fa fa-commenting-o"></i> De-Registration Review # {req.id} -
                              Status: {req.status_label}</Link>
                          </li>)
                      }
              })}
              </ul>
            </div>
          )
        }
        </I18n>
    )
  }
}

export default translate('translations')(SearchCases);
