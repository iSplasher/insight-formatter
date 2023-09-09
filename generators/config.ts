import type { NodePlopAPI } from "@crutchcorn/plop";
import fs from 'node:fs';
import path from 'node:path';

// Learn more about Turborepo Generators at https://turbo.build/repo/docs/core-concepts/monorepos/code-generation

// eslint-disable-next-line import/no-default-export -- Turbo generators require default export
export default function generator(plop: NodePlopAPI): void {
  const projectName = path.basename(path.join(__dirname, ".."));
  const projectScope = `@${projectName}`;
  const projectRoot = path.join(__dirname, "..");

  const pkgManager: "yarn" | "bun" = "bun";
  const eslintExtend = "library";
  const tsconfigExtend = "base.json";

  // read root package.json
  const pkgJsonText = fs.readFileSync(
    path.join(projectRoot, "package.json"),
    "utf8"
  );
  const pkgjson = JSON.parse(pkgJsonText);

  // calculate spaces for indentation
  const spaces = Math.max(
    ...[2].concat(pkgJsonText.match(/ +/g)?.map((s) => s.length) ?? [])
  );

  const data = {
    projectScope,
  };

  // A simple generator to add a new React component to the internal UI library
  plop.setGenerator("package", {
    description: "Adds a new workspace package",
    prompts: [
      {
        type: "input",
        name: "name",
        message: "What is the name of the package?",
      },
      {
        type: "input",
        name: "description",
        message: "What is the description of the package?",
        default: "",
      },
      {
        type: "list",
        name: "workspace",
        message: "Where should the package be created?",
        choices: () => {
          // get workspaces
          const workspaces = pkgjson.workspaces.map((w: string) =>
            w.replace("/*", "")
          );

          return workspaces;
        },
      },
    ],
    actions: [
      {
        type: "add",
        path: "{{ workspace }}/{{dashCase name}}/package.json",
        templateFile: "templates/package/package-json.hbs",
        data,
      },
      {
        type: "add",
        path: "{{ workspace }}/{{dashCase name}}/README.md",
        templateFile: "templates/package/readme-md.hbs",
        data,
      },
      {
        type: "add",
        path: "{{ workspace }}/{{dashCase name}}/tsconfig.json",
        templateFile: "templates/package/tsconfig-json.hbs",
        data: {
          ...data,
          tsconfigExtend,
        },
      },
      {
        type: "add",
        path: "{{ workspace }}/{{dashCase name}}/.eslintrc.js",
        templateFile: "templates/package/eslintrc-js.hbs",
        data: {
          ...data,
          eslintExtend,
        },
      },
      {
        type: "modify",
        path: path.join(projectRoot, "package.json"),
        pattern: /(?<insertion>(?<="scripts":\s*{))/g,
        template:
          JSON.stringify(
            (() => {
              const prefix =
                // @ts-expect-error
                pkgManager === "yarn"
                  ? `yarn workspace ${projectScope}/{{dashCase name}}`
                  : `cd {{orkspace }}/{{dashCase name}} && bun`;

              return {
                "run:{{dashCase name}}": `${prefix}`,
                "add:{{dashCase name}}": `${prefix} add`,
                "remove:{{dashCase name}}": `${prefix} remove`,
              };
            })(),
            null,
            spaces
          ).slice(1, -2) + ",",
      },
    ],
  });
}
