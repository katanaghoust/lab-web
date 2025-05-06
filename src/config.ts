import EmailPassword from 'supertokens-node/recipe/emailpassword';
import Session from 'supertokens-node/recipe/session';
import Dashboard from 'supertokens-node/recipe/dashboard';
import UserRoles from 'supertokens-node/recipe/userroles';
import type { TypeInput } from 'supertokens-node/types';

export function getApiDomain() {
  const apiPort = 3000;
  const apiUrl = `http://localhost:${apiPort}`;
  return apiUrl;
}

export function getWebsiteDomain() {
  const websitePort = 3001;
  const websiteUrl = `http://localhost:${websitePort}`;
  return websiteUrl;
}

export const SuperTokensConfig: TypeInput = {
  supertokens: {
    connectionURI:
      'https://st-dev-157ceb50-29d0-11f0-8622-951f65f9b4b5.aws.supertokens.io',
    apiKey: '0Sh2trXwu4Ckk4z4aG4Ck4wDSX',
  },
  appInfo: {
    appName: 'SuperTokens App',
    apiDomain: getApiDomain(),
    websiteDomain: getWebsiteDomain(),
    apiBasePath: '/auth',
  },
  recipeList: [
    EmailPassword.init(),
    Dashboard.init(),
    UserRoles.init(),
    Session.init({
      getTokenTransferMethod: () => 'cookie',
    }),
  ],
};
