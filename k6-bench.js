import { check, sleep } from 'k6';
import http from 'k6/http';

export const options = {
  vus: 1000,
  duration: '10m',
};

export default function () {
  const res = http.get('http://localhost:3000/usuarios-com-cache');

  check(res, {
    'status is 200': (r) => r.status === 200,
  });

  sleep(0.1);
}
