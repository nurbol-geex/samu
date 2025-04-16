import {APIMethods} from '../APIMethods';
import {APIRoutes} from '../APIRoutes';
import {apiHandler} from '../apiHandler';
import store from '../../redux';

export function resetPasswordAPI(
  password: string,
  confirmationPassword: string,
) {
  return apiHandler<ResetPasswordResponse>({
    method: APIMethods.POST,
    url: APIRoutes.User.ResetPassword(),
    body: {
      password,
      confirmationPassword,
    },
    headers: {
      Authorization: `Bearer ${store.getState().user.accessToken}`,
    },
  });
}
