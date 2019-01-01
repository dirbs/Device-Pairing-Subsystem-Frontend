/*
Copyright (c) 2018 Qualcomm Technologies, Inc.
All rights reserved.

Redistribution and use in source and binary forms, with or without modification, are permitted (subject to the limitations in the disclaimer below) provided that the following conditions are met:

* Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
* Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
* Neither the name of Qualcomm Technologies, Inc. nor the names of its contributors may be used to endorse or promote products derived from this software without specific prior written permission.
NO EXPRESS OR IMPLIED LICENSES TO ANY PARTY'S PATENT RIGHTS ARE GRANTED BY THIS LICENSE. THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/

import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
 
i18n
  .use(LanguageDetector)
  .init({
    // we init with resources
    resources: {
      en: {
        translations: {
          "welcomeApp": "Welcome to ProjectName",
          "homeLink"  : "Home",
          "dashboardLink": "Dashboard",
          "searchRequestLink": "Search Request",
          "generatePairCodeLink": "Generate Pair Code",
          "requestStatusLink": "Request Status",
          "imsiRequestsLink": "IMSI Requests",
          "bulkUploadLink": "Bulk Upload",
          "bulkStatusLink": "Bulk Status",

          //Request Module
          "requests.header":"IMSI Requests",
          "requests.id":"Request ID",
          "requests.actions":"Actions",
          "requests.addImsi":"Add IMSI",
          "requests.addImsiFor":"Add IMSI for:",
          "requests.downloadDocuments":"Download all requests document",
          "requests.downloadFilename":"Request-Documents",

          //MODAL
          "modal.addImsi": "Type IMSI",
          "modal.imsilabel": "Type IMSI",
          "modal.imsiplaceholder": "Type IMSI",
          "modal.addreImsi": "Retype IMSI",
          "modal.reimsilabel": "Retype IMSI",
          "modal.reimsiplaceholder": "Retype IMSI",
          "modal.close": "Close",
          "modal.add": "Add",

          //BULK
          "uploadDocument":"Upload IMSI Document",
          "selectIMSIfile":'Select IMSI file',

          //Common
          "submit":"Submit"
        }
      },
      es: {
        translations: {
          "welcomeApp": "Bienvenido a ProjectName",
          "homeLink"  : "Casa",
          "dashboardLink": "Tablero",
          "searchRequestLink": "Solicitud de búsqueda",
          "generatePairCodeLink": "Generar código de par",
          "requestStatusLink": "Estado de la solicitud",
          "imsiRequestsLink": "IMSI Requests",
          "bulkUploadLink": "Bulk Upload",
          "bulkStatusLink": "Bulk Status",

          //Request Module
          "requests.header":"IMSI Requests",
          "requests.id":"Request ID",
          "requests.actions":"Actions",
          "requests.addImsi":"Add IMSI",
          "requests.downloadDocuments":"Download all requests document",
          "requests.downloadFilename":"Request-Documents",

          //MODAL
          "modal.addImsi": "Add IMSI",
          "modal.imsilabel": "Enter IMSI",
          "modal.imsiplaceholder": "Enter IMSI",
          "modal.addreImsi": "Add Re-IMSI",
          "modal.reimsilabel": "Enter Re-IMSI",
          "modal.reimsiplaceholder": "Enter Re-IMSI",
          "modal.close": "Close",
          "modal.add": "Add"
        }
      },
      id: {
        translations: {
          "welcomeApp": "Selamat datang di ProjectName",
          "homeLink"  : "Rumah",
          "dashboardLink": "Dasbor",
          "searchRequestLink": "Permintaan Pencarian",
          "generatePairCodeLink": "Hasilkan Kode Pasangan",
          "requestStatusLink": "Status Permintaan",
          "imsiRequestsLink": "IMSI Requests",
          "bulkUploadLink": "Bulk Upload",
          "bulkStatusLink": "Bulk Status",

          //Request Module
          "requests.header":"IMSI Requests",
          "requests.id":"Request ID",
          "requests.actions":"Actions",
          "requests.addImsi":"Add IMSI",
          "requests.downloadDocuments":"Download all requests document",
          "requests.downloadFilename":"Request-Documents",

          //MODAL
          "modal.addImsi": "Add IMSI",
          "modal.imsilabel": "Enter IMSI",
          "modal.imsiplaceholder": "Enter IMSI",
          "modal.addreImsi": "Add Re-IMSI",
          "modal.reimsilabel": "Enter Re-IMSI",
          "modal.reimsiplaceholder": "Enter Re-IMSI",
          "modal.close": "Close",
          "modal.add": "Add"
        }
      }
    },
    fallbackLng: 'en',
    debug: false,
 
    // have a common namespace used around the full app
    ns: ['translations'],
    defaultNS: 'translations',
 
    keySeparator: false, // we use content as keys
 
    interpolation: {
      escapeValue: false, // not needed for react!!
      formatSeparator: ','
    },
 
    react: {
      wait: true
    }
  });
 
export default i18n;