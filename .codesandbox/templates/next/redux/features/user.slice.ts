//** Import Redux
import { createSlice } from '@reduxjs/toolkit';
//** Create userSlice

export const userSlice = createSlice({
  name: 'user',
  initialState: {
    userInfo: {
      userId: '',
      email: [],
      nickName: '',
      name: '',
      userName: '',
      status: '',
      avatar: '',
      avatarType: '',
      type: '',
      credits: 0,
      roles: [],
      emailVerified: false,
      accountType: '',
      createdAt: '',
      lastSessionId: '',
      referalUsers: 0,
      userNo: '',
    },
    billing: {
      accountType: '',
      credits: 0,
    },
    user: {},
    tokens: {},
    loggingIn: 'notLogin',
    invoiceList: [],
    subscriptionRecordId: null,
    subscriptionPlan: null,
    total: 1,
    params: {},
    allData: [],
    orgMemberList: [],
    onlineUsers: null,
    socketConnectStatus: false,
    token: null,
    createVistorDone: false,
  },
  reducers: {
    handleSetLoggingIn(state, action) {
      state.loggingIn = action.payload;
    },
    handleSetAccountType(state, action) {
      state.userInfo.accountType = action.payload;
    },
    handleSetOrgMemberList(state, action) {
      state.orgMemberList = action.payload;
    },
    handleSetUserInfo(state, action) {
      console.log('action.payload', action.payload);
      state.userInfo = action.payload;
    },
    handleUpdataAvatar(state, action) {
      state.userInfo.avatar = action.payload;
      state.userInfo.avatarType = 'data';
    },
    handleUpdataNickname(state, action) {
      state.userInfo.nickName = action.payload;
    },
    handleSetSubscriptionRecordId(state, action) {
      state.subscriptionRecordId = action.payload;
    },
    handleSetOnlineUsers(state, action) {
      state.onlineUsers = action.payload;
    },
    handleSetSubscriptionPlan(state, action) {
      state.subscriptionPlan = action.payload;
    },
    handleSetInvoiceList(state, action) {
      state.invoiceList = action.payload;
    },
    handleSetSocketConnectStatus(state, action) {
      state.socketConnectStatus = action.payload;
    },
    handleSetLastSessionId(state, action) {
      state.userInfo.lastSessionId = action.payload;
    },
    handleSetToken(state, action) {
      state.token = action.payload;
    },
    handleSetUser(state, action) {
      console.log('action.payload', action.payload);
      state.user = action.payload;
    },
    handleSetTokensInfo(state, action) {
      state.tokens = action.payload;
    },
  },
});

export const {
  handleUpdataNickname,
  handleUpdataAvatar,
  handleSetUserInfo,
  handleSetOrgMemberList,
  handleSetAccountType,
  handleSetSubscriptionRecordId,
  handleSetOnlineUsers,
  handleSetSubscriptionPlan,
  handleSetInvoiceList,
  handleSetLoggingIn,
  handleSetSocketConnectStatus,
  handleSetLastSessionId,
  handleSetToken,
  handleSetUser,
  handleSetTokensInfo,
} = userSlice.actions;
export default userSlice.reducer;
