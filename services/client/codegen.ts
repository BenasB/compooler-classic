import { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  schema: [`http://localhost:19001/graphql`, `http://localhost:19002/graphql`],
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
          DateTime: "string",
        },
      },
    },
  },
  ignoreNoDocuments: true,
};

export default config;
