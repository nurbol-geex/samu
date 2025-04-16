import {APIMethods} from '../APIMethods';
import {APIRoutes} from '../APIRoutes';
import {apiHandler} from '../apiHandler';
import store from '../../redux';

export function getOwnAccountAPI() {
  return apiHandler<GetOwnAccountResponseBody>({
    method: APIMethods.GET,
    url: APIRoutes.User.Me(),
    headers: {
      Authorization: `Bearer ${store.getState().user.accessToken}`,
    },
  });
}
