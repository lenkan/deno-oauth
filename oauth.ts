export interface OAuthOptions {
  clientId: string;
  clientSecret: string;
  redirectUrl: string;
  authUrl: string;
  tokenUrl: string;
  profileUrl: string;
}

export function createOAuth(options: OAuthOptions) {
  function getAuthorizationUrl(scope: string) {
    const search = new URLSearchParams();
    search.set("response_type", "code");
    search.set("scope", scope);
    search.set("client_id", options.clientId);
    search.set("redirect_uri", options.redirectUrl);
    search.set("state", "123");
    const authLocation = `${options.authUrl}?${search.toString()}`;
    return authLocation;
  }

  async function getToken(code: string) {
    const search = new URLSearchParams();
    search.set("grant_type", "authorization_code");
    search.set("code", code);
    search.set("redirect_uri", options.redirectUrl);
    search.set("client_id", options.clientId);
    search.set("client_secret", options.clientSecret);
    const tokenUrl = `${options.tokenUrl}?${search.toString()}`;
    const response = await fetch(tokenUrl, {
      method: "POST",
    });

    if (!response.ok) {
      throw new Error(
        `Failed to get access token ${response.status} ${response.statusText}`,
      );
    }

    return response.json();
  }

  async function getProfile(accessToken: string) {
    const response = await fetch(
      options.profileUrl,
      {
        headers: {
          "Accept": "application/json",
          "Authorization": `Bearer ${accessToken}`,
        },
      },
    );

    if (!response.ok) {
      throw new Error(
        `Failed to get user profile ${response.status} ${response.statusText}`,
      );
    }

    return response.json();
  }

  return {
    getAuthorizationUrl,
    getToken,
    getProfile,
  };
}
