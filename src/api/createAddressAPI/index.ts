import {APIMethods} from '../APIMethods';
import {APIRoutes} from '../APIRoutes';
import {apiHandler} from '../apiHandler';
import store from '../../redux';

export function createAddressAPI(
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
  return apiHandler<CreateAddressResponse>({
    method: APIMethods.POST,
    url: APIRoutes.User.Address(),
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
