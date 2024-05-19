import { MONITORING_ENDPOINT_DOMAIN, PROXY_ENDPOINT } from "./constants";
import { proxyFetch } from "../../../apiproxy/proxyFetch";
import { MinerStatus } from "wemine-apis";

export type MinerStatusInfo = {
  friendlyMinerId: string;
  statusInfo: MinerStatus;
};

export function getMinerStatusInfosHandler() {
  return proxyFetch<MinerStatusInfo[]>({
    endpoint: `${MONITORING_ENDPOINT_DOMAIN}/minerstatusinfo`,
    requestOptions: {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    },
  });
}
