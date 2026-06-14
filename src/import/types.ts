export interface ImportReport {
  processed: number;
  imported: number;
  warnings: number;
  errors: number;
  anomalies: ImportAnomaly[];
}

export interface ImportAnomaly {
  row: number;
  type: string;
  severity: "WARNING" | "ERROR";
  message: string;
  action: string;
}