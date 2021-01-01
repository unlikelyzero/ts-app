import {
  DbConnectionName,
  dbConnectionNames,
} from "./database/db-connection-name";

interface IEnvironment {
  DB_CONNECTION: DbConnectionName;
  SERVER_PORT: number;
  NODE_ENV: NodeEnvironment;
  JWT_SECRET: string;
}

export const validNodeEnvs = ["dev", "test", "prod"] as const;
type NodeEnvironment = typeof validNodeEnvs[number];

const getEnvValue = (key: string) => {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Environment variable ${key} not found.`);
  }

  return value;
};

const getConstrainedEnvValue = <T extends string>(
  key: string,
  values: ReadonlyArray<T>
) => {
  const value = getEnvValue(key);

  if (values.includes(value as T)) {
    return value as T;
  }

  throw new Error(`Expected ${key} to be one of ${values.join(",")}`);
};

export const environment = (): IEnvironment => {
  const serverPort = getEnvValue("SERVER_PORT");

  const SERVER_PORT = parseInt(serverPort, 10);
  if (isNaN(SERVER_PORT) || SERVER_PORT <= 0) {
    throw new Error("Expected SERVER_PORT to be a positive integer");
  }

  return {
    DB_CONNECTION: getConstrainedEnvValue("DB_CONNECTION", dbConnectionNames),
    SERVER_PORT,
    NODE_ENV: getConstrainedEnvValue("NODE_ENV", validNodeEnvs),
    JWT_SECRET: getEnvValue("JWT_SECRET"),
  };
};
