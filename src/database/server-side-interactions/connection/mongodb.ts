import {
  OPERATIONS_DASHBOARD_DATABASE,
  WEMINE_NODE_ENV,
} from "../../../config";
import { MongoClient } from "mongodb";
import { Environment } from "wemine-apis";
import { defaultDbOptions } from "./url";

type MongodbDbConnectionsMap = { [Property: string]: Promise<MongoClient> };

let mongodbDbConnections: MongodbDbConnectionsMap;

if (WEMINE_NODE_ENV === Environment.DEV) {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  let globalWithMongo = global as typeof globalThis & {
    _mongodbDbConnections?: MongodbDbConnectionsMap;
  };

  if (!globalWithMongo._mongodbDbConnections) {
    const client = new MongoClient(
      defaultDbOptions.url,
      defaultDbOptions.options
    );
    globalWithMongo._mongodbDbConnections = {
      [OPERATIONS_DASHBOARD_DATABASE as string]: client.connect(),
    };
  }
  mongodbDbConnections = globalWithMongo._mongodbDbConnections;
} else {
  // In production mode, it's best to not use a global variable.
  const client = new MongoClient(
    defaultDbOptions.url,
    defaultDbOptions.options
  );
  mongodbDbConnections = {
    [OPERATIONS_DASHBOARD_DATABASE as string]: client.connect(),
  };
}

// Export a module-scoped MongoClient promise. By doing this in a
// separate module, the client can be shared across functions.
export default mongodbDbConnections;
