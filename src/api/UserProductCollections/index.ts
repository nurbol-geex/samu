import {APIMethods} from '../APIMethods';
import {APIRoutes} from '../APIRoutes';
import {apiHandler} from '../apiHandler';
 

export function getBrowseGrid() {
  return apiHandler<GetBrowseGridResponse>({
    method: APIMethods.GET,
    url: APIRoutes.User.browseGrid(),
  });
}
