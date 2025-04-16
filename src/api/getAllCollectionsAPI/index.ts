import {APIMethods} from '../APIMethods';
import {APIRoutes} from '../APIRoutes';
import {apiHandler} from '../apiHandler';

export function getAllCollectionsAPI() {
  return apiHandler<GetAllCollectionsResponse>({
    method: APIMethods.GET,
    url: APIRoutes.User.Collections(),
  });
}
