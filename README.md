# Mock API for kausityökokeilu

## Example usage

```
curl --location 'https://gateway.testbed.fi/Permits/WorkPermit_v0.1?source=virtual_finland%3Adevelopment' \
--header 'x-consent-token: <consentToken>' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer <idToken>' \
--data '{}'
```