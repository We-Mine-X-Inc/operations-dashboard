import { getActiveFacilityMaintenanceJobHandler } from "../requesthandlers/getActiveFacilityMaintenanceJobHandler";
import useSWR from "swr";
import { ACTIVE_FACILITY_MAINTENANCE_JOB_FETCH_KEY } from "./keys";

export default function useActiveFacilityMaintenanceJobRpc() {
  const {
    isLoading,
    data: activeFacilityMaintenanceJobs,
    error,
  } = useSWR(
    ACTIVE_FACILITY_MAINTENANCE_JOB_FETCH_KEY,
    getActiveFacilityMaintenanceJobHandler
  );

  const containsSingleJob =
    activeFacilityMaintenanceJobs && activeFacilityMaintenanceJobs?.length == 1;
  const finalPossibleError =
    activeFacilityMaintenanceJobs && activeFacilityMaintenanceJobs?.length > 1
      ? "Expected only one active job, there are more."
      : error;
  return {
    isLoading,
    activeFacilityMaintenanceJob: containsSingleJob
      ? activeFacilityMaintenanceJobs[0]
      : undefined,
    error: finalPossibleError,
  };
}
