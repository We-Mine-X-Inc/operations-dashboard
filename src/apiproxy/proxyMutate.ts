import { PROXY_ENDPOINT } from "../database/client-side-interactions/requesthandlers/constants";

export type MutateProxy = {
  proxyEndpoint: string;
  proxyMutateOptions: RequestInit;
};

export async function proxyMutate<T>(proxy: MutateProxy) {
  return fetch(`${PROXY_ENDPOINT}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(proxy),
  }).then(async (response) => {
    return (await response.json()) as T;
  });
}
