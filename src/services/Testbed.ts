import { APIGatewayProxyEventHeaders } from "aws-lambda";
import { decodeIdToken, verifyIdToken } from "../app/OIDC-utils";
import { AccessDeniedException, BadRequestException } from "../app/exceptions";
import Settings from "../settings.json";

export async function verifyConsent(headers: APIGatewayProxyEventHeaders, dataSourceDsi: string) {
  const { idToken, consentToken } = retrieveRequestTokens(headers);

  // Verify token
  const verified = await verifyIdToken(consentToken, Settings.consent.provider);
  const payload = verified.payload;
  const header = verified.header;

  // Verify consent
  if (payload.dsi !== dataSourceDsi) {
    throw new AccessDeniedException("Invalid dsi");
  }

  const decodedIdToken = decodeIdToken(idToken);
  if (typeof decodedIdToken?.payload !== "object" || decodedIdToken?.payload === null) {
    throw new AccessDeniedException("Invalid idToken");
  }

  // Claim verifications
  if (payload.acr !== decodedIdToken.payload.acr) {
    throw new AccessDeniedException("Token mismatch: acr");
  }
  if (payload.appiss !== decodedIdToken.payload.iss) {
    throw new AccessDeniedException("Token mismatch: appiss");
  }
  if (payload.app !== decodedIdToken.payload.aud) {
    throw new AccessDeniedException("Token mismatch: app");
  }
  if (header.v !== "0.2") {
    throw new AccessDeniedException("Token mismatch: v");
  }
  if (payload.subiss !== decodedIdToken.payload.iss) {
    throw new AccessDeniedException("Token mismatch: subiss");
  }
  if (payload.sub !== decodedIdToken.payload.sub) {
    throw new AccessDeniedException("Token mismatch: sub");
  }
}

function retrieveRequestTokens(headers: APIGatewayProxyEventHeaders) {
  const idToken = headers["authorization"]?.replace("Bearer ", "");
  if (!idToken) {
    throw new BadRequestException("Authorization is required");
  }

  const consentToken = headers["x-consent-token"];
  if (!consentToken) {
    throw new BadRequestException("Consent is required");
  }

  return { idToken, consentToken };
}
