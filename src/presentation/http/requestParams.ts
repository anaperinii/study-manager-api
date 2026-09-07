import type { Request } from 'express';

export function getIdParam(req: Request): number {
  return Number(req.params['id']);
}
