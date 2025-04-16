import {APIMethods} from './APIMethods';

export async function apiHandler<T>(request: {
  url: string;
  method: APIMethods;
  body?: any;
  headers?: any;
}): Promise<T> {
  const headers = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  };

  return <T>await fetch(request.url, {
    method: request.method,
    headers: {...headers, ...request.headers},
    body: JSON.stringify(request.body),
  });
}
