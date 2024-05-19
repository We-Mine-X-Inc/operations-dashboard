"use client";

import { ACTIVE_FACILITY_MAINTENANCE_JOB_FETCH_KEY } from "@/database/client-side-interactions/rpcs/keys";
import { startFacilityMaintenanceJobRpc } from "@/database/client-side-interactions/requesthandlers/startFacilityMaintenanceJobRpc";
import { stopFacilityMaintenanceJobRpc } from "@/database/client-side-interactions/requesthandlers/stopFacilityMaintenanceJobRpc";
import { updateFacilityMaintenanceJobRpc } from "@/database/client-side-interactions/requesthandlers/updateFacilityMaintenanceJobRpc";
import useActiveFacilityMaintenanceJobRpc from "@/database/client-side-interactions/rpcs/useActiveFacilityMaintenanceJobRpc";
import {
  HALF_HOUR_IN_MILLIS,
  ONE_HOUR_IN_MILLIS,
  getLocalISOString,
} from "@/utils/time";
import { FormEvent, useEffect, useState } from "react";
import { useSWRConfig } from "swr";

const FORM_FIELD_NAME = {
  JOB_ACTIVE: "isFacilityMaintenanceJobActive",
  END_TIME: "endTime",
  INQUIRY_PROMPT_INTERVAL: "durationBetweenInquiryPrompt",
};

export default function FarmMaintenanceJobConfigurationForm() {
  const { mutate } = useSWRConfig();
  const {
    isLoading: isActiveFacilityMaintenanceJobLoading,
    activeFacilityMaintenanceJob,
    error: activeFacilityMaintenanceJobError,
  } = useActiveFacilityMaintenanceJobRpc();
  const activeMaintenanceJobExists = !!activeFacilityMaintenanceJob;
  const initialCheckboxState = activeFacilityMaintenanceJob
    ? activeMaintenanceJobExists
    : true;

  const [isEnableMaintenanceJobToggleChecked, setChecked] =
    useState(initialCheckboxState);

  useEffect(() => {
    if (!isActiveFacilityMaintenanceJobLoading) {
      setChecked(initialCheckboxState);
    }
  }, [isActiveFacilityMaintenanceJobLoading, initialCheckboxState]);

  if (isActiveFacilityMaintenanceJobLoading) return "Loading...";

  if (activeFacilityMaintenanceJobError)
    return "There was an error. Try refreshing the page.";

  async function submitFacilityMaintenanceJobForm(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const facilityMaintenanceJobId = activeMaintenanceJobExists
      ? activeFacilityMaintenanceJob._id.toString()
      : "";

    const jobActiveCheckbox = formData.get(FORM_FIELD_NAME.JOB_ACTIVE);
    const isEnablingJob = !!jobActiveCheckbox?.valueOf();
    if (!isEnablingJob && activeMaintenanceJobExists) {
      await stopFacilityMaintenanceJobRpc({ facilityMaintenanceJobId });
      return;
    }

    const submittedEndTime = formData.get(FORM_FIELD_NAME.END_TIME);
    if (!submittedEndTime) return;

    const baseMaintenanceJobConfig = {
      endTime: new Date(submittedEndTime.toString()).toISOString(),
      durationBetweenInquiryPrompt: formData
        .get(FORM_FIELD_NAME.INQUIRY_PROMPT_INTERVAL)
        ?.valueOf(),
    };

    if (isEnablingJob && activeMaintenanceJobExists) {
      await updateFacilityMaintenanceJobRpc({
        facilityMaintenanceJobId,
        maintenanceJobConfig: baseMaintenanceJobConfig,
      });
    } else if (!activeMaintenanceJobExists) {
      await startFacilityMaintenanceJobRpc({
        ...baseMaintenanceJobConfig,
        startTime: new Date(Date.now()).toISOString(),
      });
    }
    mutate(
      ACTIVE_FACILITY_MAINTENANCE_JOB_FETCH_KEY,
      /* data= */ undefined,
      /* opts= */ true
    );
  }

  async function onFacilityMaintenanceJobActivationToggleClick() {
    setChecked(!isEnableMaintenanceJobToggleChecked);
  }

  const minDateTimeMillis = activeFacilityMaintenanceJob
    ? activeFacilityMaintenanceJob.endTime.getTime()
    : Date.now();
  const minDateTime = getLocalISOString(new Date(minDateTimeMillis));
  const maxDateTimeMillis = minDateTimeMillis + 24 * 60 * 60 * 1000;
  const maxDateTime = getLocalISOString(new Date(maxDateTimeMillis));
  return (
    <form onSubmit={submitFacilityMaintenanceJobForm}>
      <div className="flex flex-col items-center gap-y-3">
        <div className="flex flex-row gap-x-2 items-center">
          <label htmlFor={FORM_FIELD_NAME.END_TIME}>
            Maintenance End Time?
          </label>
          <input
            type="datetime-local"
            id={FORM_FIELD_NAME.END_TIME}
            name={FORM_FIELD_NAME.END_TIME}
            defaultValue={
              activeFacilityMaintenanceJob
                ? getLocalISOString(activeFacilityMaintenanceJob.endTime)
                : minDateTime
            }
            min={minDateTime}
            max={maxDateTime}
            required={true}
          />
        </div>

        <div className="flex flex-row gap-x-2 items-center">
          <label htmlFor={FORM_FIELD_NAME.INQUIRY_PROMPT_INTERVAL}>
            Prompt Interval
          </label>
          <select
            id={FORM_FIELD_NAME.INQUIRY_PROMPT_INTERVAL}
            name={FORM_FIELD_NAME.INQUIRY_PROMPT_INTERVAL}
            defaultValue={
              activeFacilityMaintenanceJob?.durationBetweenInquiryPrompt
            }
            required={true}
          >
            <option value={HALF_HOUR_IN_MILLIS}>Every 30 mins</option>
            <option value={ONE_HOUR_IN_MILLIS}>Every 60 mins</option>
          </select>
        </div>

        <div className="flex flex-row gap-x-2 items-center">
          <label htmlFor={FORM_FIELD_NAME.JOB_ACTIVE}>
            {isEnableMaintenanceJobToggleChecked ? "Disbale" : "Enable"}
          </label>
          <input
            type="checkbox"
            id={FORM_FIELD_NAME.JOB_ACTIVE}
            name={FORM_FIELD_NAME.JOB_ACTIVE}
            checked={isEnableMaintenanceJobToggleChecked}
            onChange={onFacilityMaintenanceJobActivationToggleClick}
            disabled={!activeMaintenanceJobExists}
          />
        </div>
        <div>
          <button type="submit">
            {renderSubmitButtonText({
              activeMaintenanceJobExists,
              isEnableMaintenanceJobToggleChecked,
            })}
          </button>
        </div>
      </div>
    </form>
  );
}

function renderSubmitButtonText({
  activeMaintenanceJobExists,
  isEnableMaintenanceJobToggleChecked,
}: {
  activeMaintenanceJobExists: boolean;
  isEnableMaintenanceJobToggleChecked: boolean;
}) {
  return activeMaintenanceJobExists
    ? isEnableMaintenanceJobToggleChecked
      ? "Update"
      : "Stop"
    : "Start";
}
