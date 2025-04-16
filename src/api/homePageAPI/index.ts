import {APIMethods} from '../APIMethods';
import {APIRoutes} from '../APIRoutes';
import {apiHandler} from '../apiHandler';

export function getHomeSectionsAPI(geometry: {
  longitude: string;
  latitude: string;
}) {
  return apiHandler<GetHomeResponse>({
    method: APIMethods.POST,
    url: APIRoutes.User.homeData(),
    body: {
      longitude: geometry?.longitude,
      latitude: geometry?.latitude,
    },
  });
}
