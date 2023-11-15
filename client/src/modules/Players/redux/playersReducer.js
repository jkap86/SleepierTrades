const initialState = {
    page: 1,
    itemActive: '',
    itemActive2: '',
    searched: '',
    filters: {
        position: 'W/R/T/Q',
        team: 'All',
        draftClass: 'All'
    },
    sortBy: 'Owned',
    tabSecondary: 'Owned',
    searchedSecondary: ''
}

const playersReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'SET_STATE_PLAYERS':
            return {
                ...state,
                ...action.payload
            };
        default:
            return state
    }
}

export default playersReducer;