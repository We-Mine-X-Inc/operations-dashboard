import { OPERATIONS_DASHBOARD_DATABASE } from "../../../config";
import { buildConnections } from "wemine-common-utils/lib/src/databases";
import { defaultDbOptions } from "./url";

export const mongooseDbConnections = buildConnections({
  defaultDatabaseUrl: defaultDbOptions.url,
  databaseNames: [OPERATIONS_DASHBOARD_DATABASE as string],
});
