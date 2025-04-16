import {APIMethods} from '../APIMethods';
import {APIRoutes} from '../APIRoutes';
import {apiHandler} from '../apiHandler';

export function phoneConfirmAPI(
  phone: string,
  code: string,
  uuid: string,
  device: Device,
) {
  return apiHandler<PhoneConfirmResponse>({
    method: APIMethods.POST,
    url: APIRoutes.User.PhoneConfirm(),
    body: {
      phone,
      code,
      uuid,
      device,
    },
  });
}
