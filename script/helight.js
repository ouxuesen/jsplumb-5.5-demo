
export const splitD = '->'
export const changeID = function (stringId) {
    return stringId.replaceAll('.', '_')
}
let findActiveNode = function (sourceIdTargetId, relations,heightColor) {
    var elements = []
    var storeRelations = []

    relations.forEach(relation => {
         let relat= changeID(relation.relat)
        if (relat && relat.indexOf(sourceIdTargetId) != -1) {
            relat.split(splitD).forEach(itemKey => {
                elements.push({
                    columnID: itemKey,
                    heightColor: heightColor
                })
            })
            storeRelations.push(relat)
        }
    })
    return {
        elements: elements,
        relations: storeRelations
    }
}
let heightlightColumn = function (heightlightColumnIDs,relations) {
    return activeNode('', true,relations, heightlightColumnIDs)
}

let activeNode = function (sourceIdTargetId, select,relations,heightlightColumnIDs) {
    
    if (sourceIdTargetId == undefined) {
        return
    }
    heightlightColumnIDs = heightlightColumnIDs||[]
    let tempSouce = [].concat(heightlightColumnIDs)
    if (sourceIdTargetId.length > 0) {
        tempSouce = tempSouce.concat([sourceIdTargetId])
    }
    if (select) {

    } else {
        if (!heightlightColumnIDs.includes(sourceIdTargetId)) {
            tempSouce = [sourceIdTargetId]
        } else {
            tempSouce = []
        }
    }
    let activeNodesDic = tempSouce.reduce((tempActiveNodes, targId) => {
        let uniteNodes = findActiveNode(targId,relations)
        return {
            elements: tempActiveNodes.elements.concat(uniteNodes.elements),
            relations: tempActiveNodes.relations.concat(uniteNodes.relations)
        }
    }, {
        elements: [],
        relations: []
    })

    return activeNodesDic
}
export const columnActiveNodeDic = function (columnID, select,relations) {
    if (columnID == undefined) {
        return
    }
    return activeNode(columnID, select,relations)
}
export const lineActiveNodeDic = function (sourceId, targetId, select,relations) {
   return activeNode(sourceId + splitD + targetId, select,relations)
}

