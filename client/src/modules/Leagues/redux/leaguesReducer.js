const initialState = {
    page: 1,
    itemActive: '',
    searched: '',
    tabSecondary: 'Standings'

}

const leaguesReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'SET_STATE_LEAGUES':
            return {
                ...state,
                ...action.payload
            };
        default:
            return state
    }
}

export default leaguesReducer;