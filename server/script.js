import http from 'k6/http';
import { sleep } from 'k6';

export const options = {
  vus: 300, // stimulate how many virtual users
  duration: "30s", // how long you want it to run
};
// Below randomize the endpoints
export default function () {
  http.get(`http://localhost:3010/qa/questions/${Math.floor(Math.random() * (1000000 - 1 + 1)) + 1}/answers`);
}
