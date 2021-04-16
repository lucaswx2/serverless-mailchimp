# serverless-mailchimp
Serverless aplication that send leads to mailchimp through API

## Instruction of how to use:


1. Clone this repository
2. Run aws configure to set your credentials
3. run sls deploy on terminal
4. Go to your aws console and set the following variables:

```javascript
API_KEY = your api key
AUDIENCE_ID = your audience Id
DATACENTER = your server (you can get it from the url when logged in your mailchimp account)
BUFFER_HASH = any random string
```

