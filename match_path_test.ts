import { matchPath, PathParams, MatchPathOptions } from "./match_path.ts";
import { assertEquals } from "https://deno.land/std@v0.41.0/testing/asserts.ts";

function verify(
  pattern: string,
  path: string,
  expected: PathParams | null,
  opts: MatchPathOptions | undefined = undefined,
): [string, () => void] {
  return [
    `matchPath("${pattern}", "${path}") -> ${JSON.stringify(expected)}`,
    () => assertEquals(matchPath(pattern, path, opts), expected),
  ];
}

Deno.test(...verify("/foo", "/foos", null));
Deno.test(...verify("/foo", "/foo", {}));
Deno.test(...verify("/foo", "/Foo", null));
Deno.test(...verify("/foo", "/Foo", {}, { caseSensitive: false }));
Deno.test(...verify("/foo/Bar", "/foO/bar", {}, { caseSensitive: false }));
Deno.test(...verify("/foo/bar", "/foo/bar", {}));

Deno.test(...verify("/:foo", "/bar", { foo: "bar" }));
Deno.test(...verify("/:foo", "/bar", { foo: "bar" }));
Deno.test(...verify("/:foo", "/bar/baz", null));
Deno.test(...verify("/bar/:foo", "/bar/baz", { foo: "baz" }));

Deno.test(...verify("*", "", {}));
Deno.test(...verify("*", "/", {}));
Deno.test(...verify("*", "/bar", {}));
Deno.test(...verify("*", "/foo/bar", {}));

Deno.test(...verify("/*", "", null));
Deno.test(...verify("/*", "/", {}));
Deno.test(...verify("/*", "/bar", {}));
Deno.test(...verify("/*", "/foo/bar", null));
Deno.test(...verify("/foo/*", "/foo/bar", {}));
Deno.test(...verify("/:foo/*", "/baz/bar", { foo: "baz" }));
Deno.test(...verify("/*/foo", "/baz/foo", {}));
Deno.test(...verify("/*/:foo", "/baz/bar", { foo: "bar" }));
