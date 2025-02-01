// next.config.js
import fetch, { Request } from 'node-fetch';

global.Request = Request;

module.exports = {
  reactStrictMode: true,
}
