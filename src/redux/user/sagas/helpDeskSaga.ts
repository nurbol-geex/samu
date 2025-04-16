import {
    call,
    CallEffect,
    put,
    PutEffect,
    SelectEffect,
    takeLatest,
  } from 'redux-saga/effects';
  import {DELETE_ACCOUNT, HELP_DESK} from '../constants';
  import {deleteAccountAPI} from '../../../api/deleteAccountAPI';
  import {deleteAccountFailure, deleteAccountSuccess, getHelpDeskRequest, getHelpDeskFailure, getHelpDeskSuccess, resetUser, updateProfileRequest} from '../slice';
  import {getError} from 'src/utils';
  import { helpDeskAPI } from 'src/api/helpDeskAPI';
  import {showToast} from '../../../components/shared/CustomToast/toastUtils';

  function* helpDeskSaga({payload}): Generator<
  SelectEffect | PutEffect | CallEffect<DeleteAccountResponseBody>,
  void,
  never
  > {
    const { order_id, description, priority, type } = payload;

    try {
      yield put(getHelpDeskRequest({}));

      const response: Awaited<ReturnType<typeof helpDeskAPI>> = yield call(
        helpDeskAPI,
        order_id,
        description,
        priority,
        type
      );
      const json = yield response.json();
 
      if (
        'status' in response &&
        response.status >= 200 &&
        response.status < 300
      ) {
        yield put(resetUser());
        yield put(getHelpDeskSuccess({message: json.message}));
        showToast('success', 'Success', json.message);
        return;
      }
      yield put(getHelpDeskFailure({message: json.message}));
      getError(json);
      showToast('error', 'Error', json.message);
    } catch (error) {
      yield put(getHelpDeskFailure(error));
      getError(error);
    }
  }
  
  export function* watchHelpDesk() {
    yield takeLatest(HELP_DESK, helpDeskSaga);
  }
  