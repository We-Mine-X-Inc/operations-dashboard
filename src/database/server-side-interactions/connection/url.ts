import {
  OPERATIONS_DASHBOARD_DATABASE,
  DB_HOST,
  DB_PASSWORD,
  DB_CLUSTER,
} from "../../../config";

export const defaultDbOptions = {
  url: `mongodb+srv://${DB_HOST}:${DB_PASSWORD}@${DB_CLUSTER}/${OPERATIONS_DASHBOARD_DATABASE}`,
  options: {},
};
