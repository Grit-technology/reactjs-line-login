import React, { useEffect } from 'react';
import axios from 'axios';
import url from 'url';
import qs from 'qs';
import querystring from 'querystring';
import jwt from 'jsonwebtoken';

import LINE from "./line.svg";
var styles = {"App":"_1RLww","lineButton":"_RU-K2","logoButton":"icon-brand-line"};

var maxAge = 120;
var LineLogin = function LineLogin(_ref) {
  var clientID = _ref.clientID,
      clientSecret = _ref.clientSecret,
      state = _ref.state,
      nonce = _ref.nonce,
      scope = _ref.scope,
      setPayload = _ref.setPayload,
      setIdToken = _ref.setIdToken,
      redirectURI = _ref.redirectURI;

  var lineLogin = function lineLogin() {
    var query = querystring.stringify({
      response_type: 'code',
      client_id: clientID,
      state: state,
      scope: scope,
      nonce: nonce,
      prompt: 'consent',
      max_age: maxAge,
      bot_prompt: 'normal'
    });
    var lineAuthoriseURL = 'https://access.line.me/oauth2/v2.1/authorize?' + query + '&redirect_uri=' + redirectURI;
    window.location.href = lineAuthoriseURL;
  };

  var getAccessToken = function getAccessToken(callbackURL) {
    var urlParts = url.parse(callbackURL, true);
    var query = urlParts.query;
    var hasCodeProperty = Object.prototype.hasOwnProperty.call(query, 'code');

    if (hasCodeProperty) {
      var reqBody = {
        grant_type: 'authorization_code',
        code: query.code,
        redirect_uri: redirectURI,
        client_id: clientID,
        client_secret: clientSecret
      };
      var reqConfig = {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      };
      axios.post('https://api.line.me/oauth2/v2.1/token', qs.stringify(reqBody), reqConfig).then(function (res) {
        if (setPayload) setPayload(res.data);

        try {
          var decodedIdToken = jwt.verify(res.data.id_token, clientSecret, {
            algorithms: ['HS256'],
            audience: clientID.toString(),
            issuer: 'https://access.line.me',
            nonce: nonce
          });
          if (setIdToken) setIdToken(decodedIdToken);
        } catch (err) {
          console.log(err);
        }
      })["catch"](function (err) {
        console.log(err);
      });
    }
  };

  useEffect(function () {
    getAccessToken(window.location.href);
  }, [clientID]);
  return /*#__PURE__*/React.createElement("div", {
    className: styles.App
  }, /*#__PURE__*/React.createElement("div", {
    onClick: function onClick() {
      return lineLogin();
    },
    className: styles.lineButton
  }, /*#__PURE__*/React.createElement("img", {
    onClick: function onClick() {
      return lineLogin();
    },
    className: styles.logoButton,
    src:LINE

  })));
};

export { LineLogin };
//# sourceMappingURL=index.modern.js.map
