export function SET_FOLDER(state, payload) {
    state.folder = payload
}

export function RESULTS_RESET(state) {
    state.RESULTS = []
}

export function RESULTS_ADD(state, payload) {
    state.RESULTS.push(payload)
}