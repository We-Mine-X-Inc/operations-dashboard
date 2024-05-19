import { PROXY_ENDPOINT } from "../database/client-side-interactions/requesthandlers/constants";

export type FetchProxy = {
  endpoint: string;
  requestOptions: RequestInit;
};

export async function proxyFetch<T>(proxy: FetchProxy) {
  const proxyEndpoint = encodeURIComponent(proxy.endpoint);
  const proxyFetchOptions = encodeURIComponent(
    JSON.stringify(proxy.requestOptions)
  );
  return fetch(
    `${PROXY_ENDPOINT}?proxyEndpoint=${proxyEndpoint}&proxyFetchOptions=${proxyFetchOptions}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "reload",
    }
  ).then(async (response) => {
    return (await response.json()) as T;
  });
}
