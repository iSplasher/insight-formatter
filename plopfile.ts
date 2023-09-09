import type { NodePlopAPI } from "@crutchcorn/plop";
import fs from 'node:fs';
import path from 'node:path';

const projectRoot = ".";

function generators() {
  const pkgJsonText = fs.readFileSync(
    path.join(projectRoot, "package.json"),
    "utf8"
  );
  const pkgjson = JSON.parse(pkgJsonText);

  const workspaces: string[] = pkgjson.workspaces.map((w: string) =>
    w.replace("/*", "")
  );

  // check if each workspace has a generator/config.ts file
  const gs = [projectRoot, ...workspaces]
    .filter((w: string) => {
      const p = path.join(w, "generators/config.ts");
      return fs.existsSync(p);
    })
    .map(
      (w: string) =>
        projectRoot +
        "/" +
        path.relative(projectRoot, path.join(w, "generators/config.ts"))
    );

  return gs;
}

export default async function (plop: NodePlopAPI) {
  await plop.load(generators());
}
