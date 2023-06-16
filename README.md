# genai-gmail-companion
A Google Workspace add-on for Gmail and Google Drive using Node.js and Googel Cloud Vertex AI PaLM API

## Setup

### Authenticate

```sh
gcloud auth list
```

### Set active account

```sh
gcloud config set account <ACCOUNT>
```

### Set Project

```sh
gcloud config set project <PROJECT_ID>
```

## Enable Cloud APIs

```sh
gcloud services enable \
  aiplatform.googleapis.com \
  appsmarket-component.googleapis.com \
  artifactregistry.googleapis.com \
  cloudbuild.googleapis.com \
  cloudresourcemanager.googleapis.com \
  drive.googleapis.com \
  generativelanguage.googleapis.com \
  gmail.googleapis.com \
  gsuiteaddons.googleapis.com \
  run.googleapis.com
```

## Deploy to Cloud Run

### Grant Cloud Build permission to deploy

```sh
PROJECT_ID=$(gcloud config list --format='value(core.project)')
PROJECT_NUMBER=$(gcloud projects describe $PROJECT_ID --format='value(projectNumber)')
gcloud projects add-iam-policy-binding $PROJECT_ID \
    --member=serviceAccount:$PROJECT_NUMBER@cloudbuild.gserviceaccount.com \
    --role=roles/run.admin
gcloud iam service-accounts add-iam-policy-binding \
    $PROJECT_NUMBER-compute@developer.gserviceaccount.com \
    --member=serviceAccount:$PROJECT_NUMBER@cloudbuild.gserviceaccount.com \
    --role=roles/iam.serviceAccountUser
```

### Start the build

```sh
gcloud builds submit
```

### Verify service is deployed

```sh
gcloud run services list --platform managed
```

## Register the add-on

### Upload the deployment descriptor

```sh
gcloud workspace-add-ons deployments create genai-gmail-companion --deployment-file=deployment.json
```

### Authorize access to the add-on backend

```sh
SERVICE_ACCOUNT_EMAIL=$(gcloud workspace-add-ons get-authorization --format="value(serviceAccountEmail)")
gcloud run services add-iam-policy-binding \
    genai-gmail-companion \
    --member=serviceAccount:$SERVICE_ACCOUNT_EMAIL \
    --role=roles/run.invoker \
    --region=us-west1 \
    --platform=managed
```

###  Install the add-on

```sh
gcloud workspace-add-ons deployments install genai-gmail-companion
```

### To replace deployment.json

```sh
gcloud workspace-add-ons deployments replace genai-gmail-companion --deployment-file=deployment.json
```

## Configure the add-on

The following configuration should be made inside the `config/default.json` file that is deployed with the code. You will have to redeploy your code once you've made the changes to the file.

### Function URLs

Configure all the variables under `urls` in the `addOnConfig` section to point to the specific endpoints within your deployment. 

For example, if you deployed your code to `http://www.mydeployment.com/` then the value of `generateReplyUrl` will be `https://www.mydeployment.com/generateReplyUrl`

These function URLs are used for interactions between cards in the add-on.

### GenAI Providers

This add-on can be used with the list of providers below. For each provider, you can configure the `enabled` flag to show in the add-on, and any applicable configuration (i.e. API key) for that provider.

#### Vertex AI PaLM API

The add-on can use [PaLM API](https://cloud.google.com/vertex-ai/docs/generative-ai/learn/overview#palm-api) to generate and summarize text. To use this provider, you need to [create an API key](https://cloud.google.com/docs/authentication/api-keys) and save it in the `apiKey` parameter in the add-on configuration file.

Additional configurations for the provider are found in the `modules/gen_ai_providers/vertex_ai.js` file, including the models used, maximum tokens returned, and other configuration.

#### Cohere.ai

The add-on can also use [Cohere.ai](https://www.cohere.ai). To setup this provider, login to your Cohere.ai account and generate an API key, then you can save it in the `apiKey` parameter in the add-on configuration file.

Please note that we use the specialized summarization endpoint for the sumamrization feature.

Additional configurations for the provider are found in the `modules/gen_ai_providers/cohere.js` file, including the models used, maximum tokens returned, and other configuration.

### Security

#### Service Account Email

We verify all requests that hits the endpoints are coming from the add-on. We do this by comparing the service account email in the request against the configured value in `serviceAccountEmail` under the `addOnConfig` section.

To get your service account email for the add-on, follow the steps [here](https://developers.google.com/workspace/add-ons/guides/alternate-runtimes#validate-requests-from-google) or run the following command:

```sh

gcloud workspace-add-ons get-authorization

```

#### OAuth Client ID

We verify the user ID token and extract their profile name. In order to do that, we need the OAuth client ID for the add-on. 

To get the client ID, follow the steps [here] and then add the value to the `oauthClientId` variable in the `addOnConfig` section.
