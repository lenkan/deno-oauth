import { pathToRegexp } from "https://raw.githubusercontent.com/pillarjs/path-to-regexp/v6.1.0/src/index.ts";

type RouteHandler<T> = (
  params: any,
  req: T,
) => any;

type Route<T = any> = {
  regex: RegExp;
  keys: { name: string }[];
  handler: RouteHandler<T>;
};

function Router<T>() {
  const self = Object.assign(render, { use });

  const routes: Route[] = [];

  function use(route: string, handler: RouteHandler<T>) {
    const keys: any[] = [];
    const regex = pathToRegexp(route, keys, undefined);

    routes.push({ regex, keys, handler });
    return self;
  }

  function render(pathname: string, req: T) {
    for (const route of routes) {
      const result = route.regex.exec(pathname);
      if (result) {
        const params = result.slice(1).reduce<any>((params, match, index) => {
          const key = route.keys[index];
          params[key.name] = match;
          return params;
        }, {});

        return route.handler(params, req);
      }
    }
  }

  return self;
}

export { Router };
