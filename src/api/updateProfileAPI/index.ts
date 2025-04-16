import {APIMethods} from '../APIMethods';
import {APIRoutes} from '../APIRoutes';
import {apiHandler} from '../apiHandler';
import store from '../../redux';

export function updateProfileAPI(data: {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: string;
}) {
  return apiHandler({
    method: APIMethods.PUT,
    url: APIRoutes.User.Me(),
    body: data,

    headers: {
      Authorization: `Bearer ${store.getState().user.accessToken}`,
    },
  });
}
