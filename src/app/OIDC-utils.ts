import { Jwt, JwtHeader, JwtPayload, decode, verify } from "jsonwebtoken";
import jwktopem from "jwk-to-pem";

export function decodeIdToken(idToken: string) {
  return decode(idToken, { complete: true });
}

export async function verifyIdToken(idToken: string, issuerConfig: { issuer: string; jwksUri: string }): Promise<{ payload: JwtPayload; header: Record<string, string | number> }> {
  // Decode token
  const tokenResult = decodeIdToken(idToken);

  // Validate token
  const publicKey = await getPublicKey(tokenResult, issuerConfig);
  const verified = verify(idToken, publicKey.pem, { ignoreExpiration: false });
  return {
    payload: verified as JwtPayload,
    header: tokenResult?.header as any,
  };
}

export async function getPublicKey(decodedToken: Jwt | null, issuerConfig: { issuer: string; jwksUri: string }): Promise<{ pem: string; key: jwktopem.JWK }> {
  const keyId = decodedToken?.header.kid;
  const payload = decodedToken?.payload;

  // Verify input token
  if (typeof keyId !== "string" || typeof payload !== "object" || payload === null) {
    throw new Error("Bad request");
  }

  // Verify issuer before fetching the public key
  const { iss } = payload;
  if (iss !== issuerConfig.issuer) {
    throw new Error("Invalid issuer");
  }

  const key = await getJwksKey(keyId, issuerConfig.jwksUri);
  return { pem: jwktopem(key), key: key };
}

async function getJwksKey(keyId: string, jwksUri: string): Promise<jwktopem.JWK> {
  const jwks = await fetch(jwksUri).then((res) => res.json());
  if (!(jwks.keys instanceof Array)) {
    throw new Error("Invalid jwks endpoint");
  }

  const key = jwks.keys.find((key: JwtHeader) => key.kid === keyId);
  if (!key) {
    throw new Error("Public key not found in the jwks endpoint");
  }
  return key;
}
