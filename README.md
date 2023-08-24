# genai-gmail-companion

A sample Google Workspace add-on for Gmail and Google Drive using Node.js and demonstrating how to use various Generative AI APIs

## Setup

### Prerequisites

- [A Google Cloud Project](https://developers.google.com/workspace/guides/create-project).
- Make sure that you turn on billing for your Cloud project. Learn how to [verify the billing status of your projects](https://cloud.google.com/billing/docs/how-to/verify-billing-enabled).
- The [Cloud SDK](https://cloud.google.com/sdk/docs/install-sdk) configured with the Cloud project. You can skip this step if using Cloud Shell.

### Setup your environment

Follows the steps in [this guide](https://developers.google.com/workspace/add-ons/quickstart/alternate-runtimes#set-environment) to setup your environment before proceeding with the next steps. 

Once completed, you can use the `gcloud` command (for example in Cloud Shell) to proceed.

### Authenticate

Run the following command and note the `ACCOUNT` value that is provided.

```sh
gcloud auth list
```

### Set active account

Set active account using the account provided in the previous step.

```sh
gcloud config set account <ACCOUNT>
```

### Set active project

Set the project ID to the project you are using.

```sh
gcloud config set project <PROJECT_ID>
```

### Enable Cloud APIs

```sh
gcloud services enable \
  appsmarket-component.googleapis.com \
  artifactregistry.googleapis.com \
  cloudbuild.googleapis.com \
  cloudresourcemanager.googleapis.com \
  drive.googleapis.com \
  gmail.googleapis.com \
  gsuiteaddons.googleapis.com \
  run.googleapis.com
```

## Deploy backend to Cloud Run

We will deploy the backend that handles requests from the add-on to Cloud Run.

### Prepare addconfiguration file

Make a copy of the `config/default-template.json` file in the `config` folder and name it `default.json`. 

This file will be used later for configuring the add-on code. You will first deploy the code with the basic template configuration, and once you retrieve the deployment URL you will configure the add-on and deploy the code again.

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

Note the `URL` value in the response, as this will be your deployment URL to be used later in configuring the add-on.

## Configure the add-on backend

The configuration below should be made inside the `config/default.json` file that is deployed with the code. 

### Security

#### Service Account Email

We verify all requests that hits the endpoints are coming from the add-on. We do this by comparing the service account email in the request against the configured value in `serviceAccountEmail` under the `addOnConfig` section.

To get your service account email for the add-on, follow the steps [here](https://developers.google.com/workspace/add-ons/guides/alternate-runtimes#validate-requests-from-google) or run the following command:

```sh
gcloud workspace-add-ons get-authorization
```

#### OAuth Client ID

We verify the user ID token and extract their profile name. In order to do that, we need the OAuth client ID for the add-on.

To get the client ID, follow the steps [here](https://developers.google.com/workspace/add-ons/guides/alternate-runtimes#get_the_client_id) and then add the value to the `oauthClientId` variable in the `addOnConfig` section.

### Function URLs

Configure all the variables under `urls` in the `addOnConfig` section to point to the correct endpoints.

Update the `<DEPLOYMENT_URL>` variable with the deployment URL you retrieved when you deployed your Cloud Run service.

For example, if you deployed your code to `http://www.mydeployment.com/` then the value of `generateReplyUrl` will be `https://www.mydeployment.com/generateReplyUrl`

These function URLs are used for interactions between cards in the add-on.

### GenAI Providers

This add-on can be used with the list of providers below. For each provider, you can configure the `enabled` flag to show in the add-on, and any applicable configuration (i.e. API key) for that provider.

Make sure to set the `defaultProvider` variable to an enabled provider that you want to be selected by default.

#### Google Cloud Vertex AI PaLM API

The add-on can use [Google Cloud Vertex AI PaLM API](https://cloud.google.com/vertex-ai/docs/generative-ai/learn/overview#palm-api) to generate and summarize text.

You use this provider, you first need to enable the service in your Google Cloud project using the same account that you applied for (and granted access to) via the waitlist.

```sh
gcloud services enable aiplatform.googleapis.com
```

The code uses the service account attached to the Cloud Run deployment to generate access tokens to use the Vertex AI PaLM APIs. This service account by default is the  the [default Comptue Engine service account](https://cloud.google.com/compute/docs/access/service-accounts#default_service_account).

You need to grant this service account the following role in order to access the Vertex AI APIs:

`Vertex AI User (roles/aiplatform.user)`

You can either do this via the [Google Cloud Console](https://cloud.google.com/iam/docs/grant-role-console), or by using the following command (make sure to update `PROJECT_NUMBER` and `PROJECT_ID` with the relevant values for your project):

```sh
gcloud projects add-iam-policy-binding PROJECT_ID \
      --member='serviceAccount:PROJECT_NUMBER-compute@developer.gserviceaccount.com' \
      --role='roles/aiplatform.user'
```
> Learn more on service account best practices and other ways to authenticate  [here](https://cloud.google.com/iam/docs/best-practices-service-accounts). 

You can configure the region for the API in the `region` parameter (default is `us-central1`) in the relevant section for `vertexAiPalmApi` in the add-on configuration file. Please make sure the value you select corresponds to one of the Vertex AI service endpoint listed [here](https://cloud.google.com/vertex-ai/docs/reference/rest#service-endpoint).

Additional configurations for the provider are found in the `modules/gen_ai_providers/vertex_ai_palm_api.js` file, including the models used, maximum tokens returned, and other configuration.

#### Google Developer PaLM API

The add-on can use [Google Developer PaLM API](https://developers.generativeai.google/) to generate and summarize text.

> **_NOTE:_** Access to the PaLM API / MakerSuite is granted via a waitlist. You must get access through the [waitlist](https://makersuite.google.com/waitlist) before you can enable the service and generate an API key.

You use this provider, you first need to enable the service in your Google Cloud project using the same account that you applied for (and granted access to) via the waitlist.

```sh
gcloud services enable generativelanguage.googleapis.com
```

Next you should [create an API key](https://makersuite.google.com/) and save it in the `apiKey` parameter in the relevant section for `palmAPI` in the add-on configuration file. Additional configurations for the provider are found in the `modules/gen_ai_providers/palm_api.js` file, including the models used, maximum tokens returned, and other configuration.

#### Cohere.ai

The add-on can also use [Cohere.ai](https://www.cohere.ai). To setup this provider, login to your Cohere.ai account and generate an API key, then you can save it in the `apiKey` parameter in the add-on configuration file.

Please note that we use the specialized summarization endpoint for the sumamrization feature.

Additional configurations for the provider are found in the `modules/gen_ai_providers/cohere.js` file, including the models used, maximum tokens returned, and other configuration.

### Redeploy the code

Once you have finished configuring the code, you must redeploy the Cloud Run service again.

To do so, run the following command:

You will have to redeploy your code once you've made the changes to the file using the following command:

```sh
gcloud builds submit
```

Once the service is deployed, you can use the add-on.

## Register the Google Workspace Add-on

### Prepare the deployment descriptor

Make a copy of the `sample_deployment_file/deployment.json` in the main directory, and then edit the file to replace
the `<DEPLOYMENT_URL>` variables with the deployment URL for the Cloud Run service above.

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

### Install the add-on

```sh
gcloud workspace-add-ons deployments install genai-gmail-companion
```

### To replace deployment.json

If you later make any changes to the deployment descriptor `deployment.json` file (i.e. update logo, name of the add-on, supported integrations), use the following command to update the add-on:

```sh
gcloud workspace-add-ons deployments replace genai-gmail-companion --deployment-file=deployment.json
```
