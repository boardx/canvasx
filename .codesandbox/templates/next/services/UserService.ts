//** Import Redux
import store from '../redux/store';

//** Import Collections
import {
    handleSetToken,
    handleSetUserInfo,
} from '../redux/features/user.slice';
import { handleAddOnlineUser } from '../redux/features/system.slice';

//** Import Services

// import SyncService from "./SyncService";

import { handleSetOnlineUsers } from '../redux/features/user.slice';
export default class UserService {
  static service: UserService;
  public userId = '';
  static getInstance(): UserService {
    if (UserService.service == null) {
      UserService.service = new UserService();
      // Boardx.Instance.UserService = UserService.service;
    }
    return UserService.service;
  }

  componentDidMount() {
    this.initUser();
  }

  initUser() {
    // const userId = store.getState().user.userInfo.userId ? store.getState().user.userInfo.userId : '';
    // server.subscribe('users.user', userId).ready().then(() => {
    // //   const userCollection = server.collection('users').fetch();
    // //   let user = userCollection[0];
    // //     // 处理collection数据变动
    // //     userCollection.onChange(async (data) => {
    // //       this.saveStore(user);
    // //     })
    // //     setTimeout(async () => {
    // //       await this.saveStore(user);
    // //     }, 200);
    // });
  }

  async addOnlineUserToLocal() {
    // let profiles = store.getState().user.onlineUsers?.map(r=>r) ||[];
    // const user = store.getState().user.userInfo;
    // const awareness = SyncService.getInstance().awareness;
    // const uerInfo = store.getState().user.userInfo;
    // const userData = {
    //   userId: uerInfo.userId,
    //   username: uerInfo.userName,
    //   avatar: uerInfo.avatar,
    //   name: uerInfo.name,
    //   t: Date.now(),
    //   userNo: uerInfo.userNo,
    //   createdAt: new Date(),
    //   color: "",
    //   display: "none",
    // };
    // userData.color = stc(uerInfo.userName);
    // userData.avatar = uerInfo.avatar ? uerInfo.avatar : "";
    // const userInfo = store.getState().user.userInfo;
    // const updatedUserInfo = { ...userInfo, userNo: awareness?.clientID };
    // //update userNo in store userInfo
    // store.dispatch(handleSetUserInfo(updatedUserInfo));
    // awareness.setLocalState({
    //   username: uerInfo.userName,
    //   userId: userData.userId,
    //   userNo: awareness.clientID,
    //   avatar: userData.avatar,
    //   name: userData.name,
    //   color: userData.color,
    // });
    // userData.display = "none";
    // if(!profiles.find(r=>r.userNo == userData.userNo)){
    //   profiles.push(userData);
    // }else{
    //   return;
    // }
    // profiles.sort((a, b) => b.timestamp - a.timestamp);
    // store.dispatch(handleSetOnlineUsers(profiles));
  }

  async removeOnlineUserFromLocal(user: any) {
    //@ts-ignore
    let profiles = store.getState().user?.onlineUsers?.map((r: any) => r) || [];
    profiles = profiles.filter((r: any) => r.userNo != user.userNo);
    store.dispatch(handleSetOnlineUsers(profiles));
  }

  // async pubsub(boardId: any) {
  //   console.log(
  //     "pubsub",
  //     store.getState().system.addOnlineUser,
  //     boardId,
  //     store.getState().user.userInfo.userId
  //   );
  //   if (
  //     !store.getState().system.addOnlineUser &&
  //     boardId &&
  //     store.getState().user.userInfo.userId
  //   ) {
  //     store.dispatch(handleAddOnlineUser(true));
  //     // await EventService.getInstance().addOnlineUserToBoard(boardId);

  //     // await BoardService.getInstance().subscribeAndUpdate(boardId);
  //   }
  // }

  // async saveStore(result: any) {
  //   if (!store.getState().system.settings) return;
  //   const userNo = awareness?.clientID;
  //   const user = {
  //     email: result.emails[0].address,
  //     nickName: result.name,
  //     name: result.name,
  //     userName: result.username,
  //     status: result.status,
  //     avatar:
  //       result.head_url && result.head_url.indexOf("cn-boardx.oss") > -1
  //         ? ""
  //         : result.head_url,
  //     avatarType: result.updateImg ? "data" : "nickname",
  //     type: "user",
  //     userId: result.id,
  //     credits: result.credits,
  //     emailVerified: result.emails[0].verified,
  //     createdAt: result.createdAt,
  //     roles: result.roles,
  //     userNo: userNo,
  //     referalUsers: result.referalUsers,
  //   };
  //   await store.dispatch(handleSetUserInfo(user));

  //   localStorage.setItem("userRoles", JSON.stringify(result.roles));
  // }

  // async saveStoreForAnonymous(result) {
  //   const timestamp = new Date().getTime();
  //   await store.dispatch(
  //     handleSetUserInfo({
  //       email: result.emails[0].address,
  //       name: result.name,
  //       nickName: result.name,
  //       userName: result.username,
  //       status: result.status,
  //       avatar:
  //         result.head_url && result.head_url.indexOf("cn-boardx.oss") > -1
  //           ? ""
  //           : result.head_url,
  //       avatarType: result.updateImg ? "data" : "nickname",
  //       type: "anonymous",
  //       userId: result.id,
  //       credits: result.credits,
  //       emailVerified: result.emails[0].verified,
  //       createdAt: result.createdAt,
  //       roles: result.roles,
  //     })
  //   );
  // }

  logout() {
    // Util.Msg.info("logging out...");

    //exitonlineusers
    const userId = store.getState().user.userInfo.userId;
    const token = localStorage.getItem('token');
    const boardId = store.getState().board.board.id;
    // EventService.getInstance().exitOnlineUsers(userId, boardId, token);

    localStorage.removeItem('jitsiMeetId');
    localStorage.removeItem('currentOrgList');
    localStorage.removeItem('roomId');
    localStorage.removeItem('teamId');
    localStorage.removeItem('loginToken');
    localStorage.removeItem('loginTokenExpires');
    localStorage.removeItem('currentOrgId');
    localStorage.removeItem('viewportTransformation');
    localStorage.removeItem('pageFrom');
    localStorage.removeItem('firstUsedUser');
    localStorage.removeItem('latestCommands');
    localStorage.removeItem('AiCreateImgSize');
    localStorage.removeItem('AiCreateImgNum');
    localStorage.removeItem('token');
    localStorage.removeItem('ChatSessionStorage');
    const userInfo = {
      userId: '',
      email: [],
      nickName: '',
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
    };

    store.dispatch(handleSetUserInfo(userInfo));
    store.dispatch(handleSetToken(null));
    store.dispatch(handleAddOnlineUser(false));
  }
}
