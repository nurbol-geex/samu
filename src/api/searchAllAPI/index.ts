import {APIMethods} from '../APIMethods';
import {APIRoutes} from '../APIRoutes';
import {apiHandler} from '../apiHandler';

export function searchAllAPI(searchKey: string) {
  return apiHandler<searchAllResponseBody[]>({
    method: APIMethods.GET,
    url: `${APIRoutes.User.searchAll()}${searchKey}`,
  });
}
