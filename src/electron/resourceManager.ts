import osUtils from 'os-utils'
import fs from "fs"
import os from 'os'

const POLLING_INTERVAL = 500;

export function pollResources(){
    setInterval(async ()=>{
        const cpuUsage = await getCpuUsages()
        const ramUsage = getRamUsage()
        const storageData = getStorageDate()
        console.log({cpuUsage, ramUsage, storageUsage: storageData.usage})
    }, POLLING_INTERVAL)
}


export function getStaticData(){
    const totalStorage = getStorageDate().total
    const cpuModel = os.cpus()[0].model
    const totalMemoryGB = Math.floor(osUtils.totalmem() / 1024)

    return {
        totalStorage,
        cpuModel, 
        totalMemoryGB,
    }
}

function getCpuUsages() {
    return new Promise(resolve => {
        osUtils.cpuUsage(resolve)
    })
}

function getRamUsage() {
    return 1 - osUtils.freememPercentage()
}

function getStorageDate() {
    const stats = fs.statfsSync(process.platform === 'win32' ? 'C://' : '/')
    const total = stats.bsize * stats.blocks
    const free = stats.bsize * stats.bfree

    return {
        total: Math.floor(total / 1_000_000_000),
        usage: 1 - free/total
    }
}