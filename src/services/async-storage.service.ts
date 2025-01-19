export const storageService = {
    query,
    get,
    post,
    put,
    remove,
    makeId
}

type EntityId = {
    _id: string
}

function query<T>(entityType: string): T[] {
    const entities: T[] = JSON.parse(localStorage.getItem(entityType)!) || []
    return entities
}

function get<T extends EntityId>(entityType: string, entityId: string): T {
    const entities = query<T>(entityType)
    const entity = entities.find(entity => entity._id === entityId)
    if (!entity) throw new Error(`Cannot get, Item ${entityId} of type: ${entityType} does not exist`)
    return entity;
}

function post<T>(entityType: string, newEntity: T): T {
    newEntity = { ...newEntity, _id: makeId() }
    const entities = query<T>(entityType)
    entities.push(newEntity)
    _save(entityType, entities)
    return newEntity
}

function put<T extends EntityId>(entityType: string, updatedEntity: T): T {
    const entities = query<T>(entityType)
    const idx = entities.findIndex(entity => entity._id === updatedEntity._id)
    entities[idx] = updatedEntity
    _save(entityType, entities)
    return updatedEntity
}

function remove<T extends EntityId>(entityType: string, entityId: string): void {
    const entities = query<T>(entityType)
    const idx = entities.findIndex(entity => entity._id === entityId)
    if (idx !== -1) entities.splice(idx, 1)
    else throw new Error(`Cannot remove, item ${entityId} of type: ${entityType} does not exist`)
    _save(entityType, entities)
}


function _save<T>(entityType: string, entities: T[]) {
    localStorage.setItem(entityType, JSON.stringify(entities))
}

function makeId(length = 5) {
    var txt = ''
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    for (var i = 0; i < length; i++) {
        txt += possible.charAt(Math.floor(Math.random() * possible.length))
    }
    return txt
}