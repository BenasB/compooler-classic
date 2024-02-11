import { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  schema: `http://localhost:19001/graphql`,
  documents: ["app/**/*.{ts,tsx}"],
  generates: {
    "./__generated__/": {
      preset: "client",
      plugins: [],
      presetConfig: {
        gqlTagName: "gql",
      },
      config: {
        scalars: {
          TimeSpan: "string",
        },
      },
    },
  },
  ignoreNoDocuments: true,
};

export default config;
