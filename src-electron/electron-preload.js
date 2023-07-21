
const { contextBridge } = require('electron')
const path = require('path')
const fs = require('fs')

contextBridge.exposeInMainWorld('electron', {
    doAThing: () => { },
    path: path,
    fs: fs
})
