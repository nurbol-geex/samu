import { getBaseUrlFromStorage } from 'src/utils/SetENV';
import {APIMethods} from '../APIMethods';
import {APIRoutes} from '../APIRoutes';
import {apiHandler} from '../apiHandler';

export function loginWithEmailAPI(email: string, password: string) {
  return apiHandler<LoginWithEmailResponse>({
    method: APIMethods.POST,
    url: APIRoutes.User.LoginWithEmail(),
    body: {
      email,
      password,
    },
  });
}
