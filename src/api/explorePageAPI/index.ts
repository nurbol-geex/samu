import {APIMethods} from '../APIMethods';
import {APIRoutes} from '../APIRoutes';
import {apiHandler} from '../apiHandler';

export function getExploreSectionsAPI() {
  return apiHandler<GetExploreResponse>({
    method: APIMethods.GET,
    url: APIRoutes.User.exploreData(),
  });
}
