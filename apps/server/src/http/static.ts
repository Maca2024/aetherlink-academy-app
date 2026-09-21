import {existsSync} from 'node:fs';
import path from 'node:path';
import {Effect, Layer} from 'effect';
import {HttpRouter, HttpServerResponse} from 'effect/unstable/http';

const safeJoin = (root: string, requestPath: string): string | null => {
  const target = path.resolve(root, `.${decodeURIComponent(requestPath)}`);
  if (!target.startsWith(root + path.sep) && target !== root) return null;
  return target;
};

export const StaticWebLive = (dist: string | null) => {
  if (!dist || !existsSync(path.join(dist, 'index.html'))) return Layer.empty as Layer.Layer<never, never, HttpRouter.HttpRouter>;
  const root = path.resolve(dist);
  const index = path.join(root, 'index.html');
  return HttpRouter.add('GET', '/*', (request) => {
    const url = new URL(request.url, 'http://localhost');
    const target = safeJoin(root, url.pathname);
    const file = target && target !== root && existsSync(target) ? target : index;
    return HttpServerResponse.file(file).pipe(Effect.orElseSucceed(() => HttpServerResponse.empty({status: 404})));
  });
};
