import { proxyMutate } from "@/apiproxy/proxyMutate";
import { RUN_MINERS_DIAGNOSTIC_ENDPOINT } from "./constants";

export async function runMinersDiagnosticbRpc() {
  return proxyMutate({
    proxyEndpoint: `${RUN_MINERS_DIAGNOSTIC_ENDPOINT}`,
    proxyMutateOptions: {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    },
  });
}
