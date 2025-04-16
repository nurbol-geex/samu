import { injectIdToURL } from 'src/utils';
import {APIMethods} from '../APIMethods';
import {APIRoutes} from '../APIRoutes';
import {apiHandler} from '../apiHandler';

export function getProductSearchByStoreIdAPI(storeId: string, searchValue: string) {
  return apiHandler<searchAllResponseBody[]>({
    method: APIMethods.GET,
   url: `${injectIdToURL(APIRoutes.User.productSearchbyStore(),{storeId})}${searchValue}`
  });
}
