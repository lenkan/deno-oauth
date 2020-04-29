export interface PathParams {
  [key: string]: string;
}

export interface MatchPathOptions {
  caseSensitive: boolean;
}

const DEFAULT_OPTIONS = {
  caseSensitive: true,
};

export function matchPath(
  pattern: string,
  path: string,
  options: MatchPathOptions = DEFAULT_OPTIONS,
): PathParams | null {
  if (pattern === "*") {
    return {};
  }

  const patternSegments = pattern.split("/");
  const parts = path.split("/");

  const params: Record<string, string> = {};

  function equals(a: string, b: string) {
    return options.caseSensitive
      ? a === b
      : a.toLowerCase() === b.toLowerCase();
  }

  for (let i = 0; i < Math.max(patternSegments.length, parts.length); ++i) {
    const patternSegment: string | undefined = patternSegments[i];
    const pathSegment: string | undefined = parts[i];

    if (patternSegment === undefined || pathSegment === undefined) {
      return null;
    }

    if (patternSegment === "*") {
      continue;
    }

    if (patternSegment.startsWith(":")) {
      const name = patternSegment.substring(1);
      params[name] = pathSegment;
      continue;
    }

    if (!equals(patternSegment, pathSegment)) {
      return null;
    }
  }

  return params;
}
