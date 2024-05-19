import { proxyFetch } from "@/apiproxy/proxyFetch";
import { MONITORING_ENDPOINT_DOMAIN } from "./constants";
import { FacilityMaintenanceJob } from "wemine-apis";

export function getActiveFacilityMaintenanceJobHandler() {
  const now = new Date(Date.now()).toISOString();
  return proxyFetch<FacilityMaintenanceJob[]>({
    endpoint: `${MONITORING_ENDPOINT_DOMAIN}/facilitymaintenancejobs?containedDatetime=${now}`,
    requestOptions: {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    },
  }).then((jobs) =>
    jobs.map((job) => {
      return {
        ...job,
        startTime: new Date(job.startTime),
        endTime: new Date(job.endTime),
      };
    })
  );
}
