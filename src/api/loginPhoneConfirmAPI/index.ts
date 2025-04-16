import {APIMethods} from '../APIMethods';
import {APIRoutes} from '../APIRoutes';
import {apiHandler} from '../apiHandler';

export function loginPhoneConfirmAPI(
  phone: string,
  code: string,
  uuid: string,
  device: Device,
) {
  return apiHandler<LoginPhoneConfirmResponse>({
    method: APIMethods.POST,
    url: APIRoutes.User.LoginPhoneConfirm(),
    body: {
      phone,
      code,
      uuid,
      device,
    },
  });
}
