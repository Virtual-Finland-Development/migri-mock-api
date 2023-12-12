# Mock API for kausityökokeilu

Simple mock API for kausityökokeilu. Verifies the consent token and returns dummy working permits data. 

## Example usage

```
curl --location 'https://gateway.testbed.fi/Permits/WorkPermit_v0.1?source=virtual_finland%3Adevelopment' \
--header 'x-consent-token: <consentToken>' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer <idToken>' \
--data '{}'
```

## Dummy data

The API returns dummy data that is defined at a json-file located at [./src/data/work-permit-mocks.json](./src/data/work-permit-mocks.json)