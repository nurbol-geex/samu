import {http, HttpResponse} from 'msw';
import {APIRoutes} from '../api/APIRoutes';
import {db} from './db';


export const handlers = [
  http.post<SignUpRequestBody, SignUpResponse>(APIRoutes.User.SignUp(), req => {
    const user = db.user.create();
    return HttpResponse.json({
      data: {message: 'success'},
    });
  }),
  http.get<never, GetOwnAccountResponse>(APIRoutes.User.Me(), req => {
    // const account: GetOwnAccountResponseBody = db.account.create();
    const account: GetOwnAccountResponseBody = {
      id: 'asdfasdf',
      email: 'json@gmail.com',
      firstName: 'json',
      lastName: 'samp',
      dateOfBirth: '11/08/1998',
      gender: 'male',
      phone: '12345678900',
      emailVerified: false,
      phoneVerified: true,
    };
    return HttpResponse.json(account);
  }),
];
