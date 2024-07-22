
import { FileSystemTree } from "@webcontainer/api";

/*
console.log(response.status);
const didc = await response.blob();
console.log(didc);
const buff = await didc.arrayBuffer();
console.log(buff);
const arr = new Uint8Array(buff);
console.log(arr);
*/

/** @satisfies {import('@webcontainer/api').FileSystemTree} */
export const files: FileSystemTree = {
  'index.js': {
    file: {
      contents: `
  import express from 'express';
  import mo from 'motoko';
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
    res.send(mo.wasm('Main.mo'));
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
      "motoko": "latest"
    },
    "scripts": {
      "start": "nodemon --watch './' index.js"
    }
  }`,
    },
  },
  'didc.min.js': {
    file: {
      contents: ``
    }
  }
};