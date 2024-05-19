import { proxyMutate } from "@/apiproxy/proxyMutate";
import { FACILITY_MAINTENANCE_JOB_ENDPOINT } from "./constants";

export async function startFacilityMaintenanceJobRpc(
  maintenanceJobConfig: any
) {
  return proxyMutate({
    proxyEndpoint: `${FACILITY_MAINTENANCE_JOB_ENDPOINT}`,
    proxyMutateOptions: {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(maintenanceJobConfig),
    },
  });
}
