import store from 'src/redux';
import {apiHandler} from '../apiHandler';
import {APIMethods} from '../APIMethods';
import {APIRoutes} from '../APIRoutes';
import {injectIdToURL, injectParamsToURL} from 'src/utils';

export function helpDeskAPI(
  order_id: string,
  description: string,
  priority: string,
  type: string,
) {
  return apiHandler<any>({
    method: APIMethods.POST,
    url: APIRoutes.User.helpDesk(),

    body: {
      order_id,
      description,
      priority,
      type,
    },
    headers: {
      Authorization: `Bearer ${store.getState().user.accessToken}`,
    },
  });
}
