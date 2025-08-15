export default function (dataset, idField = 'ID', parentField = 'PARENT', childrenField = 'CHILDREN') {
    const hashTable = Object.create(null);
    dataset.forEach(aData => hashTable[aData[idField]] = {...aData, [childrenField]: []});
    const dataTree = [];
    dataset.forEach(aData => {
        if(aData[parentField]) hashTable[aData[parentField]][childrenField].push(hashTable[aData[idField]])
        else dataTree.push(hashTable[aData[idField]])
    });
    return dataTree;
}
