import http from 'k6/http';
import { sleep } from 'k6';

export default function () {
  http.get('http://localhost:3001/qa/1000000');
  sleep(1);
}

//TO RUN:  k6 run script1.js