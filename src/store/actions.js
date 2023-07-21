import { FileExplorer } from "src/tools/FileExplorer"

const EXPLORER = new FileExplorer(window.electron.path, window.electron.fs)

/**
 * scan a folder for files with a specific extension
 * @param {object} param0 
 * @param {object} payload 
 * @returns list of files
 * @example
 * SCAN_FOLDER({ commit, state }, { folder: '/Users/ste/MyProjects/battle_ai/test/jest/__tests__/mockups/EXAMPLE_FOLDER', ext: '.png' })
 */
export async function SCAN_FOLDER({ commit, state }, payload) {
    console.log('SCAN_FOLDER', payload)
    const res = await EXPLORER.getFilesInFolder(payload.folder, payload.ext)
    return res
}
