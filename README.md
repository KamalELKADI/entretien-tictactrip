## Tasks

- [x] Line 80 characters
- [x] Endpoint /api/justify
- [x] Authentication by token
  - [x] Endpoint /api/token
  - [x] Require: email
  - [x] Return token
- [x] Limit rate = 80 000 words / day
- [x] Deployment url or public ip
- [x] Code: github
- [x] Language: NodeJs

## Bonus

- [x] Tests
- [ ] Coverage
- [x] Documentation

## Tools

- Public API: https://tictactrip-florian-bematol.herokuapp.com
- Heroku: https://dashboard.heroku.com/apps/tictactrip-florian-bematol
- Mongodb: https://cloud.mongodb.com/v2/5f7c86f1518b782682f168eb#clusters
- CircleCI: https://app.circleci.com/pipelines/github/florianbematol/entretien-tictactrip


## API

Api is limited to 80 0000 words per token, per day.

## Authenticate
**You send:**  Your  login credentials.
**You get:** An `x-api-token` with wich you can make further actions.

**Request:**
```json
POST /api/token HTTP/1.1
Content-Type: application/json

{
    "email": "test@email.com"
}
```
**Successful Response:**
```json
HTTP/1.1 200 OK
Content-Type: text/plain

e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855
```
**Failed Response:**
```json
HTTP/1.1 400 Bad Request
Content-Type: text/plain

REQUIRED EMAIL
``` 

```json
HTTP/1.1 400 Bad Request
Content-Type: text/plain

INVALID EMAIL
``` 

## Justify
**You send:** A text, with the `x-api-token` header.
**You get:** The same text justified with a maximun line length at `80` characters.

**Request:**
```json
POST /login HTTP/1.1
Content-Type: text/plain

A long sentence who need to be ... the next round.
```

**Successful Response:**
```json
HTTP/1.1 200 OK
Content-Type: text/plain

A long sentend who need to be justified ...,
And after that she tells me everything about
...
the next round.
```

**Failed Response:**
```json
HTTP/1.1 401 Unauthorized
Content-Type: text/plain

MISSING CREDENTIALS
``` 

```json
HTTP/1.1 401 Unauthorized
Content-Type: text/plain

UNAUTHORIZED ACTIONS
```

```json
HTTP/1.1 415 Unsupported Media Type
Content-Type: text/plain

UNSUPPORTED MEDIA TYPE
```

```json
HTTP/1.1 402 Payment Required
Content-Type: text/plain

Payment Required
```