import {APIMethods} from '../APIMethods';
import {APIRoutes} from '../APIRoutes';
import {apiHandler} from '../apiHandler';
import store from '../../redux';
import {injectIdToURL} from '../../utils';

export function updateAddressAPI(
  _id: string,
  name: string,
  primary: boolean,
  street: string,
  unit: string,
  city: string,
  zip: string,
  province: string,
  country: string,
  geometry: string,
  typeOfPlace: string,
  deliveryNotes: string,
) {
  return apiHandler<UpdateAddressResponse>({
    method: APIMethods.PUT,
    url: injectIdToURL(APIRoutes.User.UpdateDeleteAddress(), {addressId: _id}),
    body: {
      name,
      primary,
      street,
      unit,
      city,
      zip,
      province,
      country,
      geometry,
      typeOfPlace,
      deliveryNotes,
    },
    headers: {
      Authorization: `Bearer ${store.getState().user.accessToken}`,
    },
  });
}
