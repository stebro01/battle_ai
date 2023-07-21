
// run with
// npm run test:unit -- -t 'ScanFolder'

const path = require('path')
const fs = require('fs')
const { FileExplorer } = require('src/tools/FileExplorer.js')
const EXPLORER = new FileExplorer(path, fs)
const test_folder = '/Users/ste/MyProjects/battle_ai/test/jest/__tests__/mockups/EXAMPLE_FOLDER'

describe('ScanFolder', () => {

  beforeEach(() => {

  });

  it('can scan a folder', async () => {
    const res = await EXPLORER.getFilesInFolder(test_folder, '.png')
    console.log(res)
  });


});
