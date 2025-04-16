import {APIMethods} from '../APIMethods';
import {APIRoutes} from '../APIRoutes';
import {apiHandler} from '../apiHandler';

export function phoneVerifyAPI(phone: string) {
  return apiHandler<PhoneVerifyResponse>({
    method: APIMethods.POST,
    url: APIRoutes.User.PhoneVerify(),
    body: {
      phone,
    },
  });
}
