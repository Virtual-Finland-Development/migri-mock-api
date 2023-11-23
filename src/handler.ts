import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { ValiError, parse } from "valibot";
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
    let statusCode = 500;
    let errorType = error.type || "Internal Server Error";
    let errorMessage = error.message;

    if (error instanceof ValiError) {
      statusCode = 422;
      errorType = "Validation Error";

      console.error(JSON.stringify(error, null, 4));
    } else {
      console.error(error);
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
