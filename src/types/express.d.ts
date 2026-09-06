interface JwtPayloadShim {
  sub: string;
  role: string;
  sessionId: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayloadShim;
      requestId?: string;
    }
  }
}

export {};
