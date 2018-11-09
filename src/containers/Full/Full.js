import React, {Component} from 'react';
import {Switch, Route, Redirect} from 'react-router-dom';
import {Container} from 'reactstrap';
import Header from '../../components/Header/';
import Sidebar from '../../components/Sidebar/';
import Breadcrumb from '../../components/Breadcrumb/';
import Aside from '../../components/Aside/';
import Footer from '../../components/Footer/';
import RequestStatus from '../../components/RequestStatus/RequestStatus';

import SearchRequests from '../../views/SearchRequests/';
import GeneratePairCode from '../../views/GeneratePairCode/';
import Requests from '../../views/Requests/Requests';
import BulkUpload from '../../views/Bulk Upload/BulkUpload';
import BulkStatus from '../../views/Bulk Upload/BulkStatus';
import Page401 from '../../views/Errors/Page401';
import { I18n, translate } from 'react-i18next';
import {AUTHORITY, MNO} from "../../utilities/constants";
import {getUserType} from "../../utilities/helpers";

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


class Full extends Component {
  constructor(props) {
    super(props);
    this.changeLanguage = this.changeLanguage.bind(this);
  }

  changeLanguage(lng) {
    const { i18n } = this.props;
    i18n.changeLanguage(lng);
  }

  render() {
    return (
      <I18n ns="translations">
        {
        (t, { i18n }) => (
      <div className="app">
        <Header {...this.props} switchLanguage={this.changeLanguage} />
        <div className="app-body">
          <Sidebar {...this.props}/>
          <main className="main">
            <Breadcrumb {...this.props} />
            <Container fluid>
              <ToastContainer 
              position="top-left" 
              hideProgressBar />
              <Switch>
                {(getUserType(this.props.resources) === AUTHORITY) &&
                <Route path="/search-requests" name="SearchRequests"
                       render={(props) => <SearchRequests {...this.props} />}/>
                }
                {(getUserType(this.props.resources) === AUTHORITY) &&
                <Route path="/generate-pair-code" name="GeneratePairCode"
                       render={(props) => <GeneratePairCode {...this.props} />}/>
                }
                {(getUserType(this.props.resources) === AUTHORITY) &&
                <Route path="/request-status" name="RequestStatus" component={RequestStatus}/>
                }
                {(getUserType(this.props.resources) === AUTHORITY) &&
                <Redirect from="/" to="/search-requests"/>
                }
                {(getUserType(this.props.resources) === MNO) &&
                <Route path="/imsi-requests" name="imsiRequestsLink" render={() => <Requests {...this.props} />}/>
                }
                {(getUserType(this.props.resources) === MNO) &&
                <Route path="/bulk-upload" name="bulkUpload" render={() => <BulkUpload {...this.props} />}/>
                }
                {(getUserType(this.props.resources) === MNO) &&
                <Route path="/bulk-status" name="bulkStatus" render={() => <BulkStatus {...this.props} />}/>
                }
                {(getUserType(this.props.resources) === MNO) &&
                <Redirect from="/" to="/imsi-requests"/>
                }

                <Route path="/unauthorized-access" name="Page401"  component={Page401} />
              </Switch>
            </Container>
          </main>
          <Aside />
        </div>
        <Footer />
      </div>
      )
        }
      </I18n>
    );
  }
}

export default translate('translations')(Full);
