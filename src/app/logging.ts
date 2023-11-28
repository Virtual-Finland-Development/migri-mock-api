import { ValiError } from "valibot";

export function logError(error: any) {
  if (error instanceof ValiError) {
    console.error(JSON.stringify(error, null, 4));
  } else {
    console.error(error);
    if (typeof error === "object" && error?.cause) {
      logError(error.cause);
    }
  }
}
