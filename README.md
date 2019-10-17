# DPS Front-end
## License
Copyright (c) 2019 Qualcomm Technologies, Inc.

All rights reserved.

Redistribution and use in source and binary forms, with or without modification, are permitted (subject to the limitations in the disclaimer below) provided that the following conditions are met:

* Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
* Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
* Neither the name of Qualcomm Technologies, Inc. nor the names of its contributors may be used to endorse or promote products derived from this software without specific prior written permission.
* The origin of this software must not be misrepresented; you must not claim that you wrote the original software. If you use this software in a product, an acknowledgment is required by displaying the trademark/log as per the details provided here: https://www.qualcomm.com/documents/dirbs-logo-and-brand-guidelines
* Altered source versions must be plainly marked as such, and must not be misrepresented as being the original software.
* This notice may not be removed or altered from any source distribution.

NO EXPRESS OR IMPLIED LICENSES TO ANY PARTY'S PATENT RIGHTS ARE GRANTED BY THIS LICENSE. THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.


## Documentation
[DPS-API-Installation-Guide-1.0.0.pdf](https://github.com/dirbs/Documentation/blob/master/Device-Pairing-Subsystem/DPS-API-Installation-Guide-1.0.0.pdf)<br />
[DPS-SPA-Installation-Guide-1.0.0.pdf](https://github.com/dirbs/Documentation/blob/master/Device-Pairing-Subsystem/DPS-SPA-Installation-Guide-1.0.0.pdf) <br />
[DPS-User-Guide-Authority-1.0.0.pdf](https://github.com/dirbs/Documentation/blob/master/Device-Pairing-Subsystem/DPS-User-Guide-Authority-1.0.0.pdf)<br />
[DPS-User-Guide-MNO-1.0.0.pdf](https://github.com/dirbs/Documentation/blob/master/Device-Pairing-Subsystem/DPS-User-Guide-MNO-1.0.0.pdf)<br />

## Backend Application Repo
https://github.com/dirbs/Device-Pairing-Subsystem

## Prerequisites
```
- Node v8.9.4 or greater
- NPM v5.6.X or greater
- Nginx 1.14.X
```

## Supported Browsers
```
Chrome 63.0 (Recommended)
Internet Explorer 11.0
Firefox 52.5 ESR, 57.0
Safari 11.0
Edge 41.16299
```

## Setup

### To Install this code on your local system
```
cd /path/to/install/location
git clone https://github.com/dirbs/Device-Pairing-Subsystem-Frontend.git
```

### Install dependencies
```
npm install
```

### APIMan, Keycloak and API Configurations

**Note** For Windows users manually make a copy of settings-template.json in src directory and name it settings.json.

```
cp src/settings-template.json src/settings.json
```

### Update all the configs into the file.
```
{
  "appDetails": {
      "appName": "dps", // configure Application name, make sure that this appName must be same as mentioned in Keycloak roles, e.g. dps_authority
      "supportEmail": "support@example.com", // configure this email as it will be visible for unauthorized user
      "supportNumber": "PHONE_NUMBER", // configure this contact number as it will be visible for unauthorized user
      "defaultLanguage": "en"
  },
  "api": {
      "host": "HOST API", // Configure API Host e.g. http://www.api-example.com
      "port": "API PORT", // Configure API Port e.g. 3000
      "version": "API VERSION", // Configure API Version e.g. /api/v1/
      "use": false // for directly hitting API, make it *True*
  },
  "apiman": {
      "host": "HOST APIMAN", // configure Apiman Host e.g. http://www.apiman-example.com
      "port": "APIMAN PORT", // Configure Apiman Port e.g. 8000
      "clientId": "APIMAN CLIENT ID", // configure clientID e.g. /apiman-gateway/example/appname/1.0
      "use": true  // for hitting Apiman Gateway directly, make it *True*
  },
  "keycloak": {
      "host": "http://SERVER_IP", // keycloak url
      "port": "PORT_NUMBER", // keycloak port
      "version": "VERSION_OR_SUBPATH",
      "clientId": "CLIENT_ID",
      "realm": "REALM",
      "use": true 
  }
}
```

**Note:** Update all the URLs into the file.

### User Roles and Other Configurations
```
cd src/utilities/constants.js
```
```
// configure pagination limit
export const PAGE_LIMIT = 10;

// configure User role, make sure that this user role must be the last part of keycloak
// user’s role e.g. "dps_authority_authority" in here "dps" part refers to appName and
// second part "authority" refers to user’s type and last part "authority" refers to user
// role level configured in Keycloak.
export const AUTHORITY = 'authority';
export const MNO = 'mno';

// configure country code
export const COUNTRY_CODE = '92';
```

**Note:** Copy keycloak.json file into public directory. _Refer to KeyCloak documentation._

### Serve with hot reload (watch changes instantly) at localhost:3000
```
npm start
```

### Build for production with minification
```
npm run build
```
