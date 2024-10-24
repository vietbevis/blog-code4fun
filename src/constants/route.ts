const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  LOGOUT: '/logout',
  REGISTER: '/register',
  REFRESH_TOKEN: '/refresh-token',
  PROFILE: '/settings',
  CHANGE_PASSWORD: '/settings/account',
  NEWS: '/news',
  BACKEND: {
    // Auth routes
    LOGIN: 'auth/signin',
    LOGIN_GOOGLE: 'auth/identity/outbound/authentication',
    REGISTER: 'auth/signup',
    REFRESH_TOKEN: 'auth/refresh',

    // User routes
    LOGOUT: 'users/logout',
    CHANGE_PASSWORD: 'users/changePassWord',
    PROFILE: 'users/me',
    FOLLOW_USER: 'followers',
    GET_USER: 'public/users/byUserName',
    UPDATE_PROFILE: 'users/user-update',
    TOP_USERS: 'public/posts/users/top-posters',

    // Category routes
    CATEGORY: 'public/category',

    // Media upload routes
    MEDIA_UPLOAD: '/files/upload/client/files',

    // Post routes
    POST_DETAIL: 'public/posts/slug',
    POST_DETAIL_BY_ID: '/public/posts',
    POST_FEED: 'public/posts/feed',
    CREATE_POST: '/posts',
    LIKE_POST: '/favorites',
    POST_TAGS: 'public/posts/post-tags',
    SEARCH: 'public/posts/search-articles',
    POST_CATEGORY: 'public/category',
    SAVE_DRAFT: 'posts/draft',

    // Comment routes
    GET_COMMENTS: 'public/comments',
    GET_CHILD_COMMENTS: 'public/comments/child',
    CREATE_COMMENT: 'comments',
    DELETE_COMMENT: 'comments/disable',
    UPDATE_COMMENT: 'comments',

    // Notification routes
    TOKEN_NOTIFICATIONS: 'fcm/token'
  },
  HANDLER: {
    LOGIN: 'api/auth/login',
    LOGIN_GOOGLE: 'api/auth/login-google',
    REGISTER: 'api/auth/register',
    LOGOUT: 'api/auth/logout',
    REFRESH_TOKEN: 'api/auth/refresh-token'
  }
}

export default ROUTES
