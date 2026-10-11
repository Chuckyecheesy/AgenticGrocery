export type LicenceStatus = "authorized" | "not_authorized";

export type SourceConnector = {
  sourceId: string;
  licenceStatus: LicenceStatus;
};

export function assertConnectorMayRun(connector: SourceConnector): void {
  if (connector.licenceStatus !== "authorized") {
    throw new Error(`Connector ${connector.sourceId} is not authorized`);
  }
}
