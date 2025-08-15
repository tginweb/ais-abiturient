import {AbitOrderModel} from '../model'

const {pathToRegexp, match, parse, compile} = require("path-to-regexp");
const get = require('lodash/get');
const set = require('lodash/set');

export default function fileAction(op, path, fileId) {

    // op = add, set

    let doc = this.getDoc()
    let self: AbitOrderModel = this

    const filesInfo = self.filesInfo

    let res = false

    filesInfo.forEach((fileInfo) => {

        let matcher = match(fileInfo.path),
            matched

        const getCollection = (obj, cpath) => {

            let sub

            sub = get(obj, cpath)

            if (!sub || !Array.isArray(sub)) {
                set(doc, path, [])
                sub = get(doc, path)
            }

            return sub
        }

        if (matched = matcher(path)) {

            if (op == 'set' && fileInfo.multiple && !Array.isArray(fileId)) {
                if (fileId)
                    fileId = [fileId]
                else
                    fileId = []
            }

            res = true

            if (matched.params.id) {

                let [collectionPath, itemPath] = fileInfo.path.split('.:id.')

                const collection = get(doc, collectionPath)

                if (collection) {

                    let item = collection.id(matched.params.id)

                    if (item) {

                        if (op == 'add' && fileInfo.multiple) {

                            let sub = getCollection(item, itemPath)

                            sub.push(fileId)

                        } else if (op === 'set' || op === 'add') {

                            item[itemPath] = fileId

                        } else if (op === 'delete') {

                            if (fileInfo.multiple) {

                                let sub = getCollection(item, itemPath)

                                const fileIndex = sub.indexOf(fileId)

                                if (fileIndex > -1)
                                    sub.splice(fileIndex, 1)

                            } else {

                                item[itemPath] = null
                            }

                        }
                    }
                }
            } else {

                if (op == 'add' && fileInfo.multiple) {

                    let sub = getCollection(doc, path)
                    sub.push(fileId)

                } else if (op === 'set' || op === 'add') {

                    set(doc, path, fileId)

                } else if (op === 'delete') {

                    if (fileInfo.multiple) {

                        let sub = getCollection(doc, path)

                        const fileIndex = sub.indexOf(fileId)

                        if (fileIndex > -1)
                            sub.splice(fileIndex, 1)

                    } else {
                        set(doc, path, null)
                    }
                }

            }
        }
    })

    return res
}
