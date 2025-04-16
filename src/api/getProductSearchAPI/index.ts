import {APIMethods} from '../APIMethods';
import {APIRoutes} from '../APIRoutes';
import {apiHandler} from '../apiHandler';

export function getUniversalSearchAPI(
  keyword: string,
  longitude: number,
  latitude: number,
) {
  return apiHandler<GetSearchResponse>({
    method: APIMethods.POST,
    url: `${APIRoutes.User.universalSearch()}`,
    body: {
      keyword: keyword,
      longitude: longitude,
      latitude: latitude,
    },
  });
}
