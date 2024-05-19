import { proxyMutate } from "@/apiproxy/proxyMutate";
import { FACILITY_MAINTENANCE_JOB_ENDPOINT } from "./constants";

export async function updateFacilityMaintenanceJobRpc({
  facilityMaintenanceJobId,
  maintenanceJobConfig,
}: {
  facilityMaintenanceJobId: string;
  maintenanceJobConfig: any;
}) {
  return proxyMutate({
    proxyEndpoint: `${FACILITY_MAINTENANCE_JOB_ENDPOINT}/${facilityMaintenanceJobId}`,
    proxyMutateOptions: {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(maintenanceJobConfig),
    },
  });
}
