import {APIMethods} from '../APIMethods';
import {APIRoutes} from '../APIRoutes';
import {apiHandler} from '../apiHandler';

export function guestLoginAPI(deviceId: string) {
  return apiHandler<PhoneVerifyResponse>({
    
    method: APIMethods.POST,
    url: APIRoutes.User.guestMode(),
    body: {
        deviceId,
    },
  });
}
