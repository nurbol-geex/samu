import {APIMethods} from '../APIMethods';
import {APIRoutes} from '../APIRoutes';
import {apiHandler} from '../apiHandler';

export function getProductSearchAPI(searchKey: string) {
  return apiHandler<GetSearchResponse>({
    method: APIMethods.GET,
    url: `${APIRoutes.User.searchProduct()}${searchKey}`,
  });
}
