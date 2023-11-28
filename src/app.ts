import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { ValiError, parse } from "valibot";
import { logError } from "./app/logging";
import WorkPermitsResponseSchema from "./models/WorkPermitsResponseSchema";
import { verifyConsent } from "./services/Testbed";
import { retrieveWorkPermitsData } from "./services/WorkPermitsService";
import Settings from "./settings.json";

export async function handler(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  try {
    await verifyConsent(event.headers, Settings.consent.dataSourceDsi);

    const workPermitsResponseData = await retrieveWorkPermitsData(); // Mock data
    const workPermitsResponse = parse(WorkPermitsResponseSchema, workPermitsResponseData);

    return {
      statusCode: 200,
      body: JSON.stringify(workPermitsResponse),
    };
  } catch (error: any) {
    logError(error);

    let statusCode = error.code || 500;
    let errorType = error.type || "InternalServerError";
    let errorMessage = error.message;

    if (error instanceof ValiError) {
      statusCode = 422;
      errorType = "ValidationError";
    }

    return {
      statusCode,
      body: JSON.stringify({
        message: errorMessage,
        type: errorType,
      }),
    };
  }
}
