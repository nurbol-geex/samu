import {APIMethods} from '../APIMethods';
import {APIRoutes} from '../APIRoutes';
import {apiHandler} from '../apiHandler';

export function loginWithPhoneAPI(phone: string) {

  
  return apiHandler<LoginWithPhoneResponse>({
    method: APIMethods.POST,
    url: APIRoutes.User.LoginWithPhone(),
    body: {
      phone,
    },
  });
}
