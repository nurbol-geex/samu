import {APIMethods} from '../APIMethods';
import {APIRoutes} from '../APIRoutes';
import {apiHandler} from '../apiHandler';
import {injectParamsToURL} from '../../utils';

export function reverseGeocodingAPI(lat: number, lng: number) {
  return apiHandler<ReverseGeocodingResponseBody>({
    method: APIMethods.GET,
    url: injectParamsToURL(APIRoutes.ThirdParty.ReverseGeocode, {lat, lng}),
  });
}
