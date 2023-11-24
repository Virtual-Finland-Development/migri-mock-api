import { Jwt, JwtHeader, JwtPayload, decode, verify } from "jsonwebtoken";
import jwktopem from "jwk-to-pem";
import { AccessDeniedException, BadRequestException } from "./exceptions";

export function decodeIdToken(idToken: string) {
  return decode(idToken, { complete: true });
}

export async function verifyIdToken(idToken: string, issuerConfig: { issuer: string; jwksUri: string }): Promise<{ payload: JwtPayload; header: Record<string, string | number> }> {
  // Decode token
  const tokenResult = decodeIdToken(idToken);

  // Validate token
  const publicKey = await getPublicKey(tokenResult, issuerConfig);

  try {
    const verified = verify(idToken, publicKey.pem, { ignoreExpiration: false });
    return {
      payload: verified as JwtPayload,
      header: tokenResult?.header as any,
    };
  } catch (error) {
    throw new AccessDeniedException(error);
  }
}

export async function getPublicKey(decodedToken: Jwt | null, issuerConfig: { issuer: string; jwksUri: string }): Promise<{ pem: string; key: jwktopem.JWK }> {
  const keyId = decodedToken?.header.kid;
  const payload = decodedToken?.payload;

  // Verify input token
  if (typeof keyId !== "string" || typeof payload !== "object" || payload === null) {
    throw new BadRequestException("Invalid token resolved from the ID token");
  }

  // Verify issuer before fetching the public key
  const { iss } = payload;
  if (iss !== issuerConfig.issuer) {
    throw new AccessDeniedException("Invalid issuer");
  }

  const key = await getJwksKey(keyId, issuerConfig.jwksUri);
  return { pem: jwktopem(key), key: key };
}

async function getJwksKey(keyId: string, jwksUri: string): Promise<jwktopem.JWK> {
  const jwks = await fetch(jwksUri).then((res) => res.json());
  if (!(jwks.keys instanceof Array)) {
    throw new Error("Invalid JWKS endpoint");
  }

  const key = jwks.keys.find((key: JwtHeader) => key.kid === keyId);
  if (!key) {
    throw new AccessDeniedException("Public key not found in the JWKS endpoint");
  }
  return key;
}
