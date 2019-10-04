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

import axios from 'axios';
import Base64 from 'base-64';
import FileSaver from "file-saver";
import settings from './../settings.json';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import React from 'react';
import i18n from 'i18next';
import { ENGLISH_REGEX,
  SPANISH_REGEX,
  INDONESIAN_REGEX } from './constants';

const { defaultLanguage } = settings.appDetails;
const MySwal = withReactContent(Swal);

const {host: apiHost, port: apiPort, version: apiVersion, use: apiUse} = settings.api;
const {host: apimanHost, port: apimanPort, clientId: apimanClientId, use: apimanUse} = settings.apiman;
const {appName} = settings.appDetails;

let BASE_URL = '';

if(apiUse) {
 BASE_URL = `${apiHost}${apiPort ? ':'+ apiPort: ''}${apiVersion}`;
} else if(apimanUse) {
 BASE_URL = `${apimanHost}${apimanPort ? ':'+ apimanPort: ''}${apimanClientId}`;
}

export const instance = axios.create({
    baseURL: BASE_URL, // QA Build
});

export function getAuthHeader (token) {
  let accessToken = localStorage.getItem('token');
  if(token) {
    accessToken = token;
  }
  return {
    'Authorization': 'Bearer ' + accessToken,
    'Content-Type': 'application/json'
  }
}

export function getUserInfo () {
  return JSON.parse(Base64.decode(localStorage.getItem('userInfo')))
}

export function SweetAlert(params){
  let title = params.title
  let message = params.message
  let type = params.type

  MySwal.fire({
    title: <p>{title}</p>,
    text: message,
    type: type,
    confirmButtonText: i18n.t('button.ok')
  })
}

/**
 * Generic Errors handling for Axios
 *
 * @param context
 * @param error
 */
export function errors (context, error) {
  if (typeof error !== 'undefined') {
    if (typeof error.response === 'undefined') {
      SweetAlert({
        title: i18n.t('error'),
        message: i18n.t('serverNotResponding'),
        type: 'error'
      })
      //toast.error('API Server is not responding or You are having some network issues');
    } else {
      if (error.response.status === 400) {
        SweetAlert({
          title: i18n.t('error'),
          message: error.response.data.message,
          type: 'error'
        })
        //toast.error(error.response.data.message);
      } else if (error.response.status === 401) {
        SweetAlert({
          title: i18n.t('error'),
          message: i18n.t('sessionExpired'),
          type: 'error'
        })
        //toast.error('Your session has been expired, please wait');
        setTimeout(() => {
          window.location.reload();
        }, 3000);
      } else if (error.response.status === 403) {
        SweetAlert({
          title: i18n.t('error'),
          message: i18n.t('credentialMatch'),
          type: 'error'
        })
        //toast.error('These credential do not match our records.');
      } else if (error.response.status === 404) {
        SweetAlert({
          title: i18n.t('error'),
          message: error.response.data.message,
          type: 'error'
        })
        //toast.error(error.response.data.message);
      } else if (error.response.status === 405) {
        SweetAlert({
          title: i18n.t('error'),
          message: i18n.t('wrongHttp'),
          type: 'error'
        })
        //toast.error('You have used a wrong HTTP verb');
      } else if (error.response.status === 406) {
        SweetAlert({
          title: i18n.t('error'),
          message: error.response.data.message,
          type: 'error'
        })
        //toast.error(error.response.data.message);
      } else if (error.response.status === 409) {
        SweetAlert({
          title: i18n.t('error'),
          message: error.response.data.message,
          type: 'error'
        })
        //toast.error(error.response.data.message, { autoClose: 10000 });
      } else if (error.response.status === 422) {
        SweetAlert({
          title: i18n.t('error'),
          message: error.response.data.Error === null ? i18n.t('unprocessibleEntity'): error.response.data.Error,
          type: 'error'
        });
        let errors = error.response.data.messages;
        for (var key in errors) {
          var caseErrors = errors[key];
          for (var i in caseErrors) {

            //toast.error(caseErrors[i][0], { autoClose: 10000 });
          }
        }
      } else if (error.response.status >= 500) {
        SweetAlert({
          title: i18n.t('error'),
          message: i18n.t('serverNotResponding'),
          type: 'error'
        })
        //toast.error("API Server is not responding or You are having some network issues", { autoClose: 8000 });
      }
    }
  }
}

/**
 * Media query function for responsive interfaces logic
 * @param maxWidth
 * @param condition1
 * @param condition2
 * @returns {*}
 */
export function matchMedia (maxWidth,condition1,condition2) {
  return window.matchMedia(`(max-width: ${maxWidth}px)`).matches?condition1:condition2
}

/**
 * a function to extract an extension from file
 * @param param
 * @returns {*}
 */
export function getExtension(param){
    return param.slice((Math.max(0, param.lastIndexOf(".")) || Infinity) + 1)
}

/**
 * A function to download files
 * @param config
 * @param link
 * @param e
 */
export function downloadBulkFile(config,link, e) {
  e.preventDefault()
  instance.get(`mno-error-file?url=${link}`, config)
    .then(response => {
      if (response.status === 200) {
        try {
          let file = new File([response.data], `Bulk.csv`);
          FileSaver.saveAs(file);
        } catch (err) {
          let file = new Blob([response.data]);
          window.navigator.msSaveBlob(file, `Bulk.csv`);
        }
      }
    })
    .catch(error => {
      errors(this, error);
    })
}

/**
 * this function get all groups of currently loggedIn user
 *
 * @param resources
 * @returns {string}
 */
export function getUserGroups (resources) {
  let groups = '';
  let groupDetails = (((resources || {}).realm_access || {}).roles || []);
  // Remove default group first
  let index = groupDetails.indexOf('uma_authorization');
  if (index !== -1)
      groupDetails.splice(index, 1);
  if(groupDetails.length > 0) {
    groups = groupDetails;
  }
  return groups;
}

/**
 * This functions get users' groups assigned by Keycloak and see if user has access to this application
 *
 * @param groups
 * @returns {boolean}
 */
export function isPage401(groups) {
  let pageStatus = false; // assume it's not page401
  pageStatus = (groups.length > 0) ? false : true; // if groups exist then that's not page401
  if (! pageStatus) { // if groups exist then we apply another check
    pageStatus = _isValidAppName(groups) ? false : true; // app name is same as role assigned
  }
  return pageStatus;
}

/**
 *
 *
 * @param groupDetails
 * @returns {*}
 * @private
 */
function _isValidAppName(groupDetails) {
  return groupDetails.find(app => app.split('_')[0] === appName)
}

/**
 * this function get currently loggedIn user Role
 *
 * @param resources
 * @returns {string}
 */
export function getUserRole(resources) {
  let role = '';
  let roleStatus = false;
  let groupDetails = (((resources || {}).realm_access || {}).roles || []);
  if (groupDetails.length > 0) {
    roleStatus = _isValidAppName(groupDetails) ? true : false;
    role = _isValidAppName(groupDetails);
  }
  if (roleStatus) {
    if(role.split('_')[2]) {
      role = role.split('_')[2];
    }
  }
  return role;
}

/**
 * Get current LoggedIn User Type
 *
 * @param resources
 * @returns {string}
 */
export function getUserType(resources) {
  let type = '';
  let typeStatus = false;
  let groupDetails = (((resources || {}).realm_access || {}).roles || []);
  if (groupDetails.length > 0) {
    typeStatus = _isValidAppName(groupDetails) ? true : false;
    type = _isValidAppName(groupDetails);
  }
  if (typeStatus) {
    if(type.split('_')[1]) {
      type = type.split('_')[1];
    }
  }
  return type;
}

export function languageCheck(text) {
  if(ENGLISH_REGEX.test(text) && defaultLanguage==="en"){
    return true;
  }else if(SPANISH_REGEX.test(text) && defaultLanguage==="es"){
    return true;
  }else return INDONESIAN_REGEX.test(text) && defaultLanguage === "id";
}