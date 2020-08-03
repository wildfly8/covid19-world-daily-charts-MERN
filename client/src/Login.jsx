import React, { useEffect } from 'react';
import * as OktaSignIn from '@okta/okta-signin-widget';
import '@okta/okta-signin-widget/dist/css/okta-sign-in.min.css';

import config from './config';

const Login = () => {
  useEffect(() => {
    const { pkce, issuer, clientId, redirectUri, responseType, scopes, idps, idpDisplay } = config.oidc;
    const widget = new OktaSignIn({
      /**
       * Note: when using the Sign-In Widget for an OIDC flow, it still
       * needs to be configured with the base URL for your Okta Org. Here
       * we derive it from the given issuer for convenience.
       */
      baseUrl: issuer.split('/oauth2')[0],
      clientId: clientId,
      redirectUri: redirectUri,
      getAccessToken: true,
      getIdToken: true,
      logo: '/react.svg',
      i18n: {
        'en': {
          'primaryauth.title': 'Sign in Monad Wisdom',
        },
        'es': {
          'primaryauth.title': 'Iniciar sesión Monad Wisdom'
        },
        'zh-CN': {
          'primaryauth.title': '登录 如是智慧'
        },
        'zh-TW': {
          'primaryauth.title': '登錄 如實智慧'
        }
      },
      features: {
        registration: true,
        rememberMe: true,
      },
      idps: idps,
      idpDisplay: idpDisplay,
      scopes: scopes,
      authParams: {
        issuer,
        pkce,
        responseType: responseType,
        display: 'page',
        // scopes,
        // responseMode: pkce ? 'query' : 'fragment',
      },
    });

    widget.renderEl(
      { el: '#sign-in-widget' },
      () => {
        /**
         * In this flow, the success handler will not be called beacuse we redirect
         * to the Okta org for the authentication workflow.
         */
      },
      (err) => {
        throw err;
      },
    );
  }, []);

  return (
    <div>
      <div id="sign-in-widget" />
    </div>
  );
};
export default Login;
