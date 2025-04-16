import DeviceInfo from 'react-native-device-info';
import {APIMethods} from '../APIMethods';
import {APIRoutes} from '../APIRoutes';
import {apiHandler} from '../apiHandler';

export async function signUpAPI(
  firstName: string,
  lastName: string,
  dateOfBirth: string,
  gender: string,
  email: string,
  phone: string,
  password: string,
  confirmationPassword: string,
) {
  // Get the device ID asynchronously
  const deviceId = await DeviceInfo.getUniqueId();

  // Make the API request with the device ID
  return apiHandler<SignUpResponse>({
    method: APIMethods.POST,
    url: APIRoutes.User.SignUp(),
    body: {
      firstName,
      lastName,
      dateOfBirth,
      gender,
      email,
      phone,
      password,
      confirmationPassword,
      deviceId, 
    },
  });
}
