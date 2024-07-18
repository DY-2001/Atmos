import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    token: null,
    userInfo: null,
};



// export const fetchUser = createAsyncThunk('user/fetchUser', async (email) => {
//     const data = await response.json();
//     return data;
// });


export const userSlice = createSlice({
    name: 'userInfo',
    initialState,
    reducers: {
        login: (state, action) => {
            // console.log("login action", action.payload);
            localStorage.setItem("token", action.payload.token);
            state.userInfo = action.payload.user;
            state.token = action.payload.token;
            console.log(state.userInfo);

        },
        logout: (state, action) => {
            localStorage.removeItem("user");
            state.user = null;
        },
        

    }
});

export const userInfo = (state) => state.user.user;
export const { login, logout, addProjectToUser, addProjectToFavourite, removeProjectFromFavourite, assignTaskToUser, removeTaskFromUser, removeProjectFromUser } = userSlice.actions;
export default userSlice.reducer;