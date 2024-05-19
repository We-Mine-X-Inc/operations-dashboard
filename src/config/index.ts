import { config } from "dotenv";
config({ path: `.env.${process.env.NODE_ENV || "development"}.local` });
import { convertStringToEnum } from "wemine-common-utils/lib/src/environment";

export const CREDENTIALS = process.env.CREDENTIALS === "true";

export const WEMINE_NODE_ENV = convertStringToEnum(process.env.NODE_ENV);

export const {
  // Google Auth Provider
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,

  // Database config
  DB_HOST,
  DB_PASSWORD,
  DB_CLUSTER,

  // Databases
  OPERATIONS_DASHBOARD_DATABASE,
} = process.env;
