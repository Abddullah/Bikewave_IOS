import {
  SOCKET_URL,
  BASE_URL,
  STRIPE_API_BASE_URL,
  STRIPE_SECRET_KEY,
  GOOGLE_MAPS_API_KEY,
  GOOGLE_MAPS_URL,
  STRIPE_REFRESH_URL,
  STRIPE_RETURN_URL,
  STRIPE_RETURN_DOMAIN_URL,
  STRIPE_SUBSCRIPTION_PRICE_ID,
  STRIPE_SUCCESS_URL,
  STRIPE_CANCEL_URL,
  APP_CUSTOM_SCHEME,
  APP_HTTPS_DOMAIN,
  APP_HTTP_DOMAIN,
  STRIPE_PUBLISHABLE_KEY
} from '@env';

export const EnvConfig = {
  socket: {
    url: SOCKET_URL,
  },
  api: {
    baseUrl: BASE_URL,
  },
  stripe: {
    baseUrl: STRIPE_API_BASE_URL,
    secretKey: STRIPE_SECRET_KEY,
    refreshUrl: STRIPE_REFRESH_URL,
    returnUrl: STRIPE_RETURN_URL,
    returnDomainUrl: STRIPE_RETURN_DOMAIN_URL,
    priceId: STRIPE_SUBSCRIPTION_PRICE_ID,
    successUrl: STRIPE_SUCCESS_URL,
    cancelUrl: STRIPE_CANCEL_URL,
    publishKey:STRIPE_PUBLISHABLE_KEY
  },
  googleMaps: {
    apiKey: GOOGLE_MAPS_API_KEY,
    geocodeUrl: GOOGLE_MAPS_URL,
  },
  app: {
    scheme: APP_CUSTOM_SCHEME,
    httpsDomain: APP_HTTPS_DOMAIN,
    httpDomain: APP_HTTP_DOMAIN,
  },
};
