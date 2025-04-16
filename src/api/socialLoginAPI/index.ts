import {getBaseUrlFromEmail} from 'src/utils/SetENV';
import {APIMethods} from '../APIMethods';
import {APIRoutes} from '../APIRoutes';
import {apiHandler} from '../apiHandler';

export function socialLoginAPI(
  email: string,
  signupType: string,
  authorizationCode: string,
  appleUserId: string,
) {
  let body = {
    email: email,
    signupType: signupType,
    appleUserId: appleUserId,
    authorizationCode: authorizationCode,
  };
  if (!body?.email) {
    delete body?.email;
  }
  getBaseUrlFromEmail(email); 
  return apiHandler<SignUpResponse>({
    method: APIMethods.POST,
    url: APIRoutes.User.socialAuth(),
    body: body,
  });
}

export function emailVerify(email: string, appleUserId: string) {
  let body = {
    email: email,
    appleUserId: appleUserId
  }
  if (!body?.email) {
    delete body?.email;
  }

  getBaseUrlFromEmail(email);
  return apiHandler<SignUpResponse>({
    method: APIMethods.POST,
    url: APIRoutes.User.EamilVerify(),
    body: body
  });
}
