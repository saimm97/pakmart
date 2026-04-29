import { type Request, type Response, type NextFunction } from "express";
import { randomUUID } from "node:crypto";

const COOKIE_NAME = "pakmart_sid";

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      sessionId: string;
    }
  }
}

export function sessionMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  const existing = req.cookies?.[COOKIE_NAME];
  let sid: string;
  if (typeof existing === "string" && existing.length > 0) {
    sid = existing;
  } else {
    sid = randomUUID();
    res.cookie(COOKIE_NAME, sid, {
      httpOnly: true,
      sameSite: "lax",
      maxAge: 1000 * 60 * 60 * 24 * 90,
      path: "/",
    });
  }
  req.sessionId = sid;
  next();
}
