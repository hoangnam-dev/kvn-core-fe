import { SignJWT, jwtVerify, type JWTPayload } from 'jose';

interface Token extends JWTPayload {
    userId: string;
}

export async function sign(payload: Token, secret: string): Promise<string> {
    const iat = Math.floor(Date.now() / 1000);
    const exp = iat + 60 * 60; // one hour

    return await new SignJWT(payload)
        .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
        .setExpirationTime(exp)
        .setIssuedAt(iat)
        .setNotBefore(iat)
        .sign(new TextEncoder().encode(secret));
}

export async function verify(token: string, secret: string): Promise<Token> {
    const { payload } = await jwtVerify<Token>(token, new TextEncoder().encode(secret));
    return payload;
}
