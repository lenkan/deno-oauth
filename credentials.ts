const credentialsData = JSON.parse(
  new TextDecoder().decode(Deno.readFileSync("credentials.json")),
) as {
  web: {
    client_id: string;
    project_id: string;
    auth_uri: string;
    token_uri: string;
    auth_provider_x509_cert_url: string;
    client_secret: string;
    redirect_uris: string[];
  };
};
export interface Credentials {
  client_id: string;
  project_id: string;
  auth_uri: string;
  token_uri: string;
  auth_provider_x509_cert_url: string;
  client_secret: string;
  redirect_uris: string[];
}

interface CredentialsJSON {
  web: Credentials;
}

export const credentials = credentialsData.web;
