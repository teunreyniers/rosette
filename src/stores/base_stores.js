
import { writable, get, derived } from "svelte/store";
import { move } from "../helpers/array";


export function createStateStore(start_value) {

    const { update, set, subscribe } = writable(start_value)

    return {
        subscribe,
        update: (path, value) => update((state) => updateState(state, path, value)),
        handleUpdate: (path) => event => update(state => updateState(state, path, event.target ? event.target.value : event.detail.value))
    }

}


function updateState(state, path, value) {
    state[path] = value
    return state
}


export function createSortableListStore(start_value, newfunc) {

    const { update, set, subscribe } = writable(start_value)


    return {
        subscribe,
        do: (action, payload) => update((state) => updateListStore(state, action, payload, newfunc)),
        handle: ({ detail }) => update(state => updateListStore(state, detail.action, detail)),
        handleUpdate: (key, path) => (event) => update(state => updateListStore(state, 'update', createPayload(key, path, event), newfunc)),
        add_n: (number) => update(state => Array.from({ length: number }).reduce((a, _) => updateListStore(a, 'add', {}, newfunc), state)),
        limit_to: (number) => update(state => state.filter((_, i) => i < number)),
        numberOfItems: () => get({ subscribe }).length,
    }
}

function createPayload(key, path, event) {
    return {
        key, path, value: event.target? event.target.value : event.detail.value
    }
}


function doActionInTree(tree, keys, path, action) {
    if (keys === undefined || Array.isArray(keys) && keys.length === 0) return action(tree)
    if (!Array.isArray(keys)) {
        
        return doLastStep(tree, keys, path, action)
    }
    const [key, ...nextKeys] = keys
    if (nextKeys.length === 0) {
        return doLastStep(tree, keys, path, action)
    }
    const [prop, ...nextPath] = path

    return updateTreeItem(tree, e => e.key === key, e => ({
        ...e,
        [prop]: doActionInTree(e[prop], nextKeys, nextPath, action)
    }))
}

function doLastStep(tree, key, path, action) {
    if (!path || Array.isArray(path) && path.length === 0) {
        return updateTreeItem(tree, (e) => e.key == key, action)
    }
    let prop = path
    if (Array.isArray(path)) {
        prop = path[0]
    }
    return updateTreeItem(tree, (e) => e.key == key, e => ({
        ...e,
        [prop]: action(e[prop])
    }))
}

function updateTreeItem(tree, match, action) {
    return tree.map(e => match(e) ? action(e) : e)
}

function deleteItem(state, payload) {
    const { key, path } = payload
    const keys = Array.isArray(key) ? key : [key]
    const lastkey = keys.pop()
    return doActionInTree(state, keys, path, arr => arr.filter((e) => e.key != lastkey))
}

function addItem(state, payload, newfunc) {
    const { pos, data, key, path } = payload || {}
    return doActionInTree(state, key, path, arr => {
        if (pos === undefined) return [...arr, newfunc(data)]
        arr.splice(pos, 0, newfunc(data));
        return arr
    })
}


function updateItem(state, payload) {
    const { key, value, path } = payload
    return doActionInTree(state, key, path, _ => value)
}

function updateListStore(state, action, payload, newfunc) {
    switch (action) {
        case "reorder":
            const { from, to, path, fromscope, toscope } = payload;
            if (path === undefined) return move(state, from, to);
            
            const from_section = state[fromscope]
            const to_section = state[toscope]
            let part = from_section[path][from]
            state = deleteItem(state, {key: [from_section.key, part.key], path })
            return addItem(state, {key: to_section.key, path, pos: to }, () => part)
        case "delete":
            return deleteItem(state, payload)
        case "add":
            return addItem(state, payload, newfunc)
        case "update":
            return updateItem(state, payload)
        default:
            break;
    }
    return state
}


export function deriveInherit(base_store, stores, func, default_value) {

    const { subscribe } = derived([base_store, ...stores], func, default_value)

    return {
        ...base_store,
        subscribe
    }

}
