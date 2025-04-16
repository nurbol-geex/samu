import {APIMethods} from '../APIMethods';
import {APIRoutes} from '../APIRoutes';
import {apiHandler} from '../apiHandler';
import store from '../../redux';
import {injectIdToURL} from '../../utils';

export function deleteAddressAPI(_id: string) {
  return apiHandler<DeleteAddressResponseBody>({
    method: APIMethods.DELETE,
    url: injectIdToURL(APIRoutes.User.UpdateDeleteAddress(), {addressId: _id}),
    headers: {
      Authorization: `Bearer ${store.getState().user.accessToken}`,
    },
  });
}
