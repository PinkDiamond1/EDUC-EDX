const config = require( '../config/index');

module.exports.base_url = config.get('url:base_url');
module.exports.edx_api_base_url = config.get('url:edx_api_base_url');
module.exports.api_html_status_threshold = config.get('test:api_html_status_threshold');
module.exports.credentials = Object.freeze({
    adminCredentials: {
      username: config.get('adminCredential:user'),
      password: config.get('adminCredential:pass')
    }
  });

module.exports.test_exchange_object = Object.freeze({
    ministryOwnershipTeamID: config.get('testExchangeObject:ministryOwnershipTeamID'),
    contactIdentifier: config.get('testExchangeObject:contactIdentifier'),
    secureExchangeContactTypeCode: config.get('testExchangeObject:secureExchangeContactTypeCode'),
    userName: config.get('testExchangeObject:userName'),
    secureExchangeStatusCode: config.get('testExchangeObject:secureExchangeStatusCode'),
    reviewer: config.get('testExchangeObject:reviewer'),
    subject: config.get('testExchangeObject:subject'),
    isReadByMinistry: config.get('testExchangeObject:isReadByMinistry'),
    isReadByExchangeContact: config.get('testExchangeObject:isReadByExchangeContact'),
    commentContent: config.get('testExchangeObject:commentContent')
});

//Token related config
//module.exports.token_namespace = config.get('token:token_namespace');
//module.exports.token_environment = config.get('token:token_environment');
module.exports.token_client_id = config.get('token:token_client_id');
module.exports.token_client_secret = config.get('token:token_client_secret');
module.exports.token_endpoint = config.get('token:token_endpoint');

// URLS
module.exports.edx_api_url = module.exports.base_url + config.get('url:edx_api_url');

// PAGE Titles
module.exports.page_titles = Object.freeze({
    DASHBOARD: 'Dashboard',
    EXCHANGE: 'Secure Exchange Inbox',
    VIEW_EXCHANGE: 'View Message',
    NEW_EXCHANGE: 'New Message'
});