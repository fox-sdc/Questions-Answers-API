const app = require('../server/index');
const supertest = require('supertest');

const request = supertest(app);

// This test fails because 1 !== 2
it('Testing to see if Jest workd', () => {
  expect(1).toBe(1);
});