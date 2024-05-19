"use client";

import { MINER_STATUS_INFOS_FETCH_KEY } from "@/database/client-side-interactions/rpcs/keys";
import useMinerStatusInfosRpc from "@/database/client-side-interactions/rpcs/useMinerStatusInfosRpc";
import { useState } from "react";
import { useSWRConfig } from "swr";
import { MinerErrorType, MinerNetworkStatus, MinerStatus } from "wemine-apis";
import { runMinersDiagnosticbRpc as runMinersDiagnosticRpc } from "../../database/client-side-interactions/requesthandlers/runDiagnostic";

export default function MinerStatusTable() {
  const [isRunningDiagnostic, setIsRunningDiagnostic] = useState(false);
  const { mutate } = useSWRConfig();

  async function invalidateAndRefresh() {
    await mutate(
      MINER_STATUS_INFOS_FETCH_KEY,
      /* data= */ undefined,
      /* opts= */ true
    );
  }

  async function runDiagnostic() {
    setIsRunningDiagnostic(true);
    await runMinersDiagnosticRpc();
    await invalidateAndRefresh();
    setIsRunningDiagnostic(false);
  }

  const {
    isLoading: isMinerStatusInfosLoading,
    minerStatusInfos,
    error: minerStatusInfosError,
  } = useMinerStatusInfosRpc();

  if (isMinerStatusInfosLoading || isRunningDiagnostic) return "Loading...";

  if (!minerStatusInfos) return "No miners available.";

  if (minerStatusInfosError)
    return "There was an error. Try refreshing the page.";

  return (
    <div className="w-full flex flex-col items-center">
      <div className="flex flex-row gap-2">
        <button onClick={invalidateAndRefresh}>Refresh</button>
        <button onClick={runDiagnostic}>Run Diagnostic</button>
      </div>
      <table className="w-full table-auto">
        <caption>Hosted Miner Status at Columbus Facility</caption>
        <thead className="table-header-group">
          <tr className="table-row">
            <th scope="col" className="table-cell">
              FriendlyMinerId
            </th>
            <th scope="col" className="table-cell">
              Network
            </th>
            <th scope="col" className="table-cell">
              Hashrate
            </th>
            <th scope="col" className="table-cell">
              Temperature
            </th>
            <th scope="col" className="table-cell">
              Fan
            </th>
          </tr>
        </thead>
        <tbody>
          {minerStatusInfos.map((minerStatusInfo) => {
            const networkStatus = minerStatusInfo.statusInfo.networkStatus;
            const operatingErrors = minerStatusInfo.statusInfo.operatingErrors;
            return (
              <tr className="table-row" key={minerStatusInfo.friendlyMinerId}>
                <td className="table-cell">
                  {minerStatusInfo.friendlyMinerId}
                </td>
                <td className="table-cell">{getNetworkLabel(networkStatus)}</td>
                <td className="table-cell">
                  {getHashrateLabel({ operatingErrors })}
                </td>
                <td className="table-cell">
                  {getTemperatureLabel({ operatingErrors })}
                </td>
                <td className="table-cell">
                  {getFanLabel({ operatingErrors })}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function getNetworkLabel(networkStatus: MinerNetworkStatus) {
  switch (networkStatus) {
    case MinerNetworkStatus.ONLINE:
      return <div className="text-green-500">ONLINE</div>;
    default:
      return (
        <div className="text-red-500">{MinerNetworkStatus[networkStatus]}</div>
      );
  }
}

function getHashrateLabel({
  operatingErrors,
}: {
  operatingErrors: MinerErrorType[];
}) {
  return operatingErrors.includes(MinerErrorType.HASH_RATE_ERROR) ||
    operatingErrors.includes(MinerErrorType.OFFLINE_ERROR) ? (
    <UnhealthyLabel />
  ) : (
    <HealthyLabel />
  );
}

function getTemperatureLabel({
  operatingErrors,
}: {
  operatingErrors: MinerErrorType[];
}) {
  return operatingErrors.includes(MinerErrorType.TEMPERATURE_ERROR) ||
    operatingErrors.includes(MinerErrorType.OFFLINE_ERROR) ? (
    <UnhealthyLabel />
  ) : (
    <HealthyLabel />
  );
}

function getFanLabel({
  operatingErrors,
}: {
  operatingErrors: MinerErrorType[];
}) {
  return operatingErrors.includes(MinerErrorType.FAN_SPEED_ERROR) ||
    operatingErrors.includes(MinerErrorType.OFFLINE_ERROR) ? (
    <UnhealthyLabel />
  ) : (
    <HealthyLabel />
  );
}

function HealthyLabel() {
  return <div className="text-green-500">Healthy</div>;
}

function UnhealthyLabel() {
  return <div className="text-red-500">Unhealthy</div>;
}
