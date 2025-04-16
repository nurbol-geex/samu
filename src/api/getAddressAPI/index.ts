import {APIMethods} from '../APIMethods';
import {APIRoutes} from '../APIRoutes';
import {apiHandler} from '../apiHandler';
import store from '../../redux';

export function getAddressAPI() {
  return apiHandler<GetAddressResponse>({
    method: APIMethods.GET,
    url: APIRoutes.User.Address(),
    headers: {
      Authorization: `Bearer ${store.getState().user.accessToken}`,
    },
  });
}
