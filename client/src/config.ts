// TODO: Once your application is deployed, copy an API id here so that the frontend could interact with it
const apiId = 'defb9ycm0g'
export const apiEndpoint = `https://${apiId}.execute-api.us-east-1.amazonaws.com/dev`

export const authConfig = {
  // TODO: Create an Auth0 application and copy values from it into this map. For example:
  // domain: 'dev-nd9990-p4.us.auth0.com',
  domain: 'dev-rq3rabgag8mg5r0o.us.auth0.com', // Auth0 domain
  clientId: 'dwHRqx4sJ4iMuERFiR44b92qaLFKqgSb', // Auth0 client id
  callbackUrl: 'http://localhost:3000/callback'
}
