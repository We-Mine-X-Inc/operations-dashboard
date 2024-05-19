import { MutateProxy } from "@/apiproxy/proxyMutate";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const proxyEndpoint = searchParams.get("proxyEndpoint");
  const proxyFetchOptions = searchParams.get("proxyFetchOptions");
  if (!proxyEndpoint || !proxyFetchOptions) {
    return Response.error();
  }

  const endpoint = decodeURIComponent(proxyEndpoint);
  const requestOptions = JSON.parse(decodeURIComponent(proxyFetchOptions));
  const res = await fetch(endpoint, requestOptions);
  return Response.json(await res.json());
}

export async function POST(request: Request) {
  const proxyInfo = (await request.json()) as MutateProxy;
  const proxyEndpoint = proxyInfo.proxyEndpoint;
  const proxyMutateOptions = proxyInfo.proxyMutateOptions;
  if (!proxyEndpoint || !proxyMutateOptions) {
    return Response.error();
  }

  const res = await fetch(proxyEndpoint, proxyMutateOptions);
  return Response.json(await res.json());
}
