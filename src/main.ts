import { FileNode, WebContainer } from '@webcontainer/api';
import { files } from './files';
import './style.css';

document.querySelector('#app')!.innerHTML = `
  <div class="container">
    <div class="editor">
      <textarea>I am a textarea</textarea>
    </div>
    <div class="preview">
      <iframe src="loading.html"></iframe>
    </div>
  </div>
`;

/** @type {HTMLIFrameElement} */
const iframeEl = document.querySelector('iframe')!;

/** @type {HTMLTextAreaElement} */
const textareaEl = document.querySelector('textarea')!;


/** @type {import('@webcontainer/api').WebContainer}  */
let webcontainerInstance: WebContainer;

async function installDependencies() {
  // Install dependencies
  const installProcess = await webcontainerInstance.spawn('npm', ['install']);
  installProcess.output.pipeTo(new WritableStream({
    write(data) {
      console.log(data);
    }
  }));
  // Wait for install command to exit
  return installProcess.exit;
}

async function curlDidc() {
  const url = "https://raw.githubusercontent.com/dfinity/node-motoko/main/versions/latest/didc.min.js";
  const curlProcess = await webcontainerInstance.spawn('curl', [url]);
  curlProcess.output.pipeTo(new WritableStream({
    write(data) {
      console.log("curl", data);
    }
  }));
  // Wait for install command to exit
  return curlProcess.exit;
}

async function startDevServer() {
  // Run `npm run start` to start the Express app
  await webcontainerInstance.spawn('npm', ['run', 'start']);

  // Wait for `server-ready` event
  webcontainerInstance.on('server-ready', (port, url) => {
    iframeEl.src = url;
  });

}

window.addEventListener('load', async () => {
  // Call only once
  webcontainerInstance = await WebContainer.boot();
  await webcontainerInstance.mount(files);
  textareaEl.value = <string>(<FileNode>files['index.js']).file.contents;
  const packageJSON = await webcontainerInstance.fs.readFile('package.json', 'utf-8');
  console.log(packageJSON);

  const exitCode = await installDependencies();
  if (exitCode !== 0) {
    throw new Error('Installation failed');
  };

  const curlExitCode = await curlDidc();
  if (curlExitCode !== 0) {
    throw new Error('Curl - Installation failed');
  };

  startDevServer();
});