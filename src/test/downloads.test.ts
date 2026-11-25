import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const read = (p: string) => readFileSync(resolve(process.cwd(), p), "utf8");

describe("Resources downloads", () => {
  it("serves the same OpenAPI spec as the repository", () => {
    expect(read("public/downloads/openapi.yaml")).toBe(read("repository/realmailpro-api/openapi/openapi.yaml"));
  });
  it("serves the same Postman collection as the repository", () => {
    expect(read("public/downloads/realmailpro.postman_collection.json")).toBe(read("repository/realmailpro-api/postman/collection.json"));
  });
});
