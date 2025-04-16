import {APIMethods} from '../APIMethods';
import {APIRoutes} from '../APIRoutes';
import {apiHandler} from '../apiHandler';

export function browsePageAPI() {
  return apiHandler<BrowsePageResponseBody>({
    method: APIMethods.GET,
    url: APIRoutes.User.BrowsePage(),
  });
}
