export const state = () => ({
    name: false
})

export const mutations = {
    SET_NAME(state, name) {
        state.name = name || ''
        

    }
}

export const getters = {
    isLoggedIn(state, getters, rootState) { return rootState.auth.loggedIn; },
    //User(state, getters, rootState) {return rootState.auth.user},
    isAdmin(state, getters, rootState) { 
        let isAdmin = false;

        if(rootState.auth.hasOwnProperty('user'))
        {
            if(rootState.auth.user.hasOwnProperty('role') && (rootState.auth.user.role.toLowerCase() == 'admin'))
            {
                isAdmin = true;
            }
        }
        return isAdmin; 
    },
    isTech(state, getters, rootState) { 
        let isTech = false;

        if(rootState.auth.hasOwnProperty('user'))
        {
            if(rootState.auth.user.hasOwnProperty('role') && (rootState.auth.user.role.toLowerCase() == 'technical'))
            {
                isTech = true;
            }
        }
        return isTech; 
    },
}
