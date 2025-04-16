import {APIMethods} from '../APIMethods';
import {APIRoutes} from '../APIRoutes';
import {apiHandler} from '../apiHandler';
import store from '../../redux';

export function deleteAccountAPI() {
  return apiHandler<DeleteAccountResponseBody>({
    method: APIMethods.DELETE,
    url: APIRoutes.User.Me(),
    headers: {
      Authorization: `Bearer ${store.getState().user.accessToken}`,
    },
  });
}
