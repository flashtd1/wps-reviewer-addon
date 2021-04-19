const OSS = require('ali-oss'),
    config = require('./local_env.json'),
    path = require('path'),
    fs = require('fs')

// oss初始化
let client = new OSS(config.oss)

const put = async (key, file) => {
    try {
        let options = {}
        if (file.includes('index.html')) {
            console.log(file, 'set headers')
            options.headers = {
                'Cache-Control': 'no-cache, no-store'
            }
        }
        let result = await client.put(key, file, options)
        return result
    } catch (e) {
        console.log(e)
    }
}

const remove = async (key) => {
    try {
        let result = await client.delete(key)
        return result
    } catch (e) {
        console.log(e)
    }
}


const list = async () => {
    let result = await client.list()
    return result
}

const readDir = (p) => {
    let res = fs.readdirSync(p)
    res.map((f) => {
        // console.log(f)
        let filepath = path.join(p, f)
        let fst = fs.statSync(filepath)
        if (fst.isDirectory()) {
            readDir(filepath)
        } else {
            put(path.relative('./wps-addon-build', filepath).replace(/\\/g, '/'), filepath).then(() => {
                console.log(filepath + ' uploaded!')
            })
        }
    })
}





(async () => {
    let objs = ((await list()).objects || []).map(({ name }) => {
        return {
            name
        }
    })

    let removeTasks = []
    for (let i = 0; i < objs.length; i++) {
        if (objs[i].name.includes('files/')) continue
        removeTasks.push((async () => {
            await remove(objs[i].name)
            console.log(objs[i].name + ' removed')
        })())
    }
    await Promise.all(removeTasks)

    readDir('./wps-addon-build')
})()

