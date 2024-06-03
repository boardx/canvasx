export default class RemoteProcedureNames {
  // Widget
  static GET_WIDGET_BY_BOARDid = 'getWidgetsByBoardId';

  static PUBLISH_WHITEBOARD_ACTIVITY = 'publishWhiteboardActivity';

  static UPDATE_WIDGET = 'updateWidget';

  static UPDATE_WIDGET_ARR = 'updateWidgetArr';

  static INSERT_WIDGET = 'insertWidget';

  static INSERT_WIDGET_ARR = 'insertWidgetArr';

  static REMOVE_WIDGET = 'removeWidget';

  static REMOVE_WIDGET_ARR = 'removeWidgetArr';
  //Comment
  static GET_COMMENT_BY_BOARDid = 'getCommentByBoardID';

  static GET_COMMENT_BYid = 'getCommentByID';

  static ADD_COMMENT = 'addComment';

  static READ_COMMENT = 'readComment';

  static DEL_COMMENT = 'delComment';

  static UPDATE_COMMENT = 'updateComment';
  // User
  static USERS_INFO = 'usersInfo';

  static CHECK_IF_SUPPORT_ANONYMOUS_VISITOR = 'checkIfSupportAnonymousVisitor';

  static USERS_USER = 'users.user';

  static GET_ACCESS_TOKEN = 'getWechatAccessToken';

  static GET_USER_INFO = 'getUserInfo';

  static GET_WECHAT_USER = 'getWechatUserInfo';

  static GET_ANONYMOUSE_USER_ACCOUNT = 'getAnonymousUserAccount';

  static CHECK_PERMISSION = 'checkPermission';

  static SAVE_USER_PROFILE = 'saveUserProfile';

  static UPDATE_USER_AVATAR = 'updateUserAvatar';

  static REGISTER_USER = 'registerUser';

  static VALIDATE_INVITE_TOKEN = 'validateInviteToken';

  static USE_INVITE_TOKEN = 'useInviteToken';

  static IS_ANONYMOUS_USER = 'isAnonymousUser';

  static GET_USER_UNIONID = 'getUserInviteUnionId';

  static GET_USER_NAME = 'getUserName';

  static GET_NAME = 'getName';

  static GET_USER_INVITEIDid = 'getUserInviteId';

  static GET_USER_BY_UNIONid = 'getUserByUnionId';

  static CHECK_IF_USER_EXISTS_BY_USER_NAME = 'checkIfUserExistsByUserName';

  static GET_BY_EMAIL_ADDRESS = 'getByEmailAddress';

  // Room & Board
  static GET_ROOM_INFO = 'getRoomInfo';

  static GET_ROOM_MEMBER = 'getRoomMember';

  static GET_RECENT_BOARD_LIST_BY_KEY = 'getRecentBoardListByKey';

  static GET_BOARD_LIST_IN_ROOM_BY_KEY = 'getBoardListInRoomByKey';

  static UPLOAD_DESCRIPTION_TO_BOARD_BYid = 'uploadDescriptiontoBoardById';

  static UPDATE_BOARD_BYid = 'updateBoardById';

  static FAVORITE_BOARD = 'favoriteBoard';

  static GET_WHITEBOARD_BYid = 'getBoardById';

  static ADD_WHITE_BOARD = 'addWhiteboard';

  static CREATE_PRIVATE_GROUP = 'createPrivateGroup';

  static DELETE_BOARD_BYid = 'deleteBoardById';

  static MOVE_BOARD_BYid = 'moveBoardById';

  static RENAME_BOARD_BYid = 'renameBoardById';

  static RETAG_BOARD_BYid = 'retagBoardById';

  static UPLOAD_THUMBNAIL2_TO_BOARD_BYid = 'uploadThumbnail2toBoardById';

  static REMOVE_USER_FROM_ROOM = 'removeUserFromRoom';

  static REMOVE_ROOM_MODERATOR = 'removeRoomModerator';

  static ADD_ROOM_MODERATOR = 'addRoomModerator';

  static USERS_AUTOCOMPLETE = 'usersAutocomplete';

  static INVITE_USER_TO_ROOM_NOTIFICATION = 'InviteUserToRoomNotification';

  static ADD_USERS_TO_ROOM = 'addUsersToRoom';

  static SEND_INVITATION_EMAIL_TO_ROOM = 'sendInvitationEmailToRoom';

  static FIND_OR_CREATE_INVITE = 'findOrCreateInvite';

  static ROOMS_DELETE = 'roomsDelete';

  static RENAME_ROOM = 'renameRoom';

  static TOGGLE_FAVORITE = 'toggleFavorite';

  static DUPLICATE_BOARD = 'duplicateBoard';

  static GET_IMAGE_LIST_BY_KEY = 'getImageListByKey';

  static UPLOAD_IMAGE_BY_URL = 'uploadImageByUrl';

  static GET_WHITEBOARD_BY_ROOMid = 'getWhiteboardByRoomId';

  static GET_BOARD_BACK_UP = 'getBoardBackup';

  static RESTORE_BACK_UP = 'restoreBackup';

  static GET_ICON_LIST_BY_KEY = 'getIconListByKey';

  // Org
  static INSERT_NEW_ORG = 'insertNewOrg';

  static GET_ORG_MEMBER = 'getOrgMember';

  static GET_ORG_MEMBER_LIST = 'getOrgMemberList';

  static RENAME_ORGANIZATION = 'renameOrganization';

  static ADD_ONE_USER_TO_ORG = 'addOneUserToOrg';

  static CHECK_IF_USER_EXISTS_BY_EMAIL = 'checkIfUserExistsByEmail';

  static SEND_ORG_INVITATION_REGISTER_EMAIL_TO_NON_EXISTING_USER =
    'sendOrgInvitationRegisterEmailToNonExistingUser';

  static ADD_ORG_ADMIN = 'addOrgAdmin';

  static REMOVE_ORG_ADMIN = 'removeOrgAdmin';

  static REMOVE_USER_FROM_ORG = 'removeUserFromOrg';

  // Utility
  static UPLOAD_WEBSITE = 'uploadWebsite';

  //Pricing
  static CHECK_CARD_TOKEN = 'checkCardToken';
  static CREATE_SUBSCRIPTION = 'createSubscription';
  static ADD_PRICING_PLAN = 'addPricingPlan';
  static FIND_SUBSCRIPTION_BY_USERID = 'findSubscriptionByuserId';
  static RETRIEVE_SUBSCRIPTION_INFORMATION = 'retrieveSubscriptionInformation';
  static RETRIEVE_UPCOMINGINVOICE = 'retrieveUpcomingInvoice';
  static UPDATE_SUBSCRIPTION = 'updateSubscription';
  static UPDATE_SUBSCRIPTION_MEMBER = 'updateSubscriptionMember';
  static CANCEL_SUBSCRIPTION = 'cancelSubscription';
  static UPDATE_CUSTOMER = 'updateCustomer';
  static UPDATE_PAYMENT_METHOD = 'updatePaymentMethod'

}
