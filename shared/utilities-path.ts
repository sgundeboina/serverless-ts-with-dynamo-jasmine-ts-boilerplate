let path = require('path');

export function getInfoFromStack(stack: any, idx: number): string {

  let stackLines = formatPathForNix(stack).split('\n');
  let callerName = 'Undetermined';

  if (stackLines.length > (idx + 1)) {
    let match = RegExp(`\\bat ([^ ]+) `, 'gm').exec(stackLines[idx]);
    if (match) {
      callerName = match[1];
    }
  }

  return callerName;
}

export function getServiceName(fileName: string, dirName: string, alternate?: any): string {
  let fn: string = formatPathForNix(fileName);
  let dn: string = formatPathForNix(dirName);
  let tsName: string = fn.replace(formatPathForNix(`${dirName}/`), '');
  let fullName: string = `Undetermined`;
  let logDirectory = dn.replace(formatPathForNix(process.cwd()), '');
  let idx = 1;

  if(alternate){
    if(typeof alternate === 'string') {
      fullName = alternate;
    } else if (typeof alternate === 'object' && alternate.name === 'Error' && alternate.hasOwnProperty('stack')){
      fullName = getInfoFromStack(alternate.stack, idx);
    }
  }
  if (fullName === 'Undetermined') {
    fullName = getInfoFromStack(new Error('fake error').stack, 2);
  }

  let fullPath = formatPathForNix(path.join(logDirectory, tsName));
  return `${fullPath} ${fullName}`;
}

export function formatPathForNix(filePath: string): string {
  let newPath = filePath.replace(/\\/g, '/'); // Change Windows path seperator "\"" to *nix path seperator "/"
  return newPath;
}
