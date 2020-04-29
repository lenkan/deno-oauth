import { matchPath } from "./match_path.ts";

export type RouteHandler<T = any> = (
  params: Record<string, string>,
  req: T,
  next: () => void,
) => Promise<unknown> | unknown;

export interface Router<T> {
  (path: string, context: T): Promise<void>;
  use(
    pattern: string,
    handler: RouteHandler<T>,
  ): this;
}

interface Route<T = any> {
  pattern: string;
  handler: RouteHandler<T>;
}

export function createRouter<T>(): Router<T> {
  const self = Object.assign(run, { use });

  const routes: Route<T>[] = [];

  function use(pattern: string, handler: RouteHandler<T>) {
    routes.push({ pattern, handler });
    return self;
  }

  async function run(pathname: string, context: T) {
    for (const route of routes) {
      const params = matchPath(route.pattern, pathname);
      if (params) {
        await new Promise((resolve, reject) => {
          try {
            Promise.resolve(route.handler(params, context, resolve)).catch(
              reject,
            );
          } catch (error) {
            reject(error);
          }
        });
      }
    }
  }

  return self;
}
