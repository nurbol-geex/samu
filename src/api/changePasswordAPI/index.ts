import {APIMethods} from '../APIMethods';
import {APIRoutes} from '../APIRoutes';
import {apiHandler} from '../apiHandler';
import store from '../../redux';

export function changePasswordAPI(
  currentPassword: string,
  password: string,
  confirmationPassword: string,
) {
  return apiHandler<ChangePasswordResponse>({
    method: APIMethods.POST,
    url: APIRoutes.User.ChangePassword(),
    body: {
      currentPassword,
      password,
      confirmationPassword,
    },
    headers: {
      Authorization: `Bearer ${store.getState().user.accessToken}`,
    },
  });
}
