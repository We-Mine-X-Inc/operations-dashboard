import { getMinerStatusInfosHandler } from "../requesthandlers/getMinerStatusInfosHandler";
import useSWR from "swr";
import { MINER_STATUS_INFOS_FETCH_KEY } from "./keys";

export default function useMinerStatusInfosRpc() {
  const {
    isLoading,
    data: minerStatusInfos,
    error,
  } = useSWR(MINER_STATUS_INFOS_FETCH_KEY, getMinerStatusInfosHandler);

  return {
    isLoading,
    minerStatusInfos,
    error,
  };
}
