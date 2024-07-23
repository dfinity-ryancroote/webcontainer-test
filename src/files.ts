
import { FileSystemTree } from "@webcontainer/api";


/** @satisfies {import('@webcontainer/api').FileSystemTree} */
export const files: FileSystemTree = {
  'index.js': {
    file: {
      contents: `
  import express from 'express';
  import mo from 'motoko';
  import * as didc from 'didc-test';
  const app = express();
  const port = 3111;
  
mo.write('Main.mo', \`
    actor {
        public query func hello() : async Text {
            "Hello, JavaScript!"
        };
    }
    \`);

  app.get('/', (req, res) => {
    const did = mo.candid('Main.mo');
    const binding = didc.generate_ts(did);
    res.send(binding);
  });
  
  app.listen(port, () => {
    console.log(\`App is live at http://localhost:\${port}\`);
  });`,
    },
  },
  'package.json': {
    file: {
      contents: `
  {
    "name": "example-app",
    "type": "module",
    "dependencies": {
      "express": "latest",
      "nodemon": "latest",
      "motoko": "latest",
      "didc-test": "latest"
    },
    "scripts": {
      "start": "node --experimental-wasm-modules index.js"
    }
  }`,
    },
  }
};