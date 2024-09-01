# [truhlarslama.cz](truhlarslama.cz)
- Server-side generated website showcasing work of a local carpenter
- In order to make the operation as cheap as possible but still enable the customer to administer the contents of the web. I opted for free CDN to host images which are cached on the server in order to adhere to free tier CDN limits which is 500 requests per day.
- The customer has a quasy administration in the CDN and pays only the standard hosting fee on Render.com 

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test
```
