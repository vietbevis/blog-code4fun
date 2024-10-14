// Common types
export type ID = string

export interface ResponseMainType {
  code: number
  success: boolean
  message: string
  timestamp: string
}

export interface PaginationDetails {
  offset: number
  limit: number
  totalRecords: number
  totalPage: number
}

export interface PaginatedResponse<T> extends ResponseMainType {
  details: PaginationDetails & { records: T[] }
}

// User related types
export type RoleType = 'ROLE_ADMIN' | 'ROLE_USER'

export interface SocialType {
  twitter: string
  linkedin: string
  github: string
}

export interface ProfileType {
  bio: string
  website: string
  location: string
  avatarUrl: string
  social: SocialType
}

export interface AccountType {
  id: ID
  email: string
  name: string
  userName: string
  followers: number
  usersFollowing: UsersFollowingType[]
  profile: ProfileType
  followType: 'UNFOLLOW' | 'FOLLOW' | null
}

export type UsersFollowingType = Pick<AccountType, 'id' | 'name'>
export type UsersLikedPostType = UsersFollowingType & { type: string }

// Post related types
export interface Category {
  id: ID
  name: string
  slug: string
}

export interface PostType {
  id: ID
  title: string
  content: string
  shortDescription: string
  slug: string
  thumbnails: string[]
  createdBy: AccountType
  usersLikedPost: UsersLikedPostType[]
  favoriteType: string
  category: Category
  tags: string[]
  createdDate: string
  favourite: number
  totalComments: number
}

export interface PostQueryParams {
  userName?: string
  offset?: number
  limit?: number
  categoryId?: string
  tags?: string
  categoryName?: string
}

// Auth related types
export interface TokenPayload {
  userId: string
  sub: string
  roles: RoleType[]
  iss: string
  exp: number
  iat: number
  jti: string
}

export interface DeviceInfoType {
  deviceId: string
  deviceType: string
}

export interface LoginResponseType {
  accessToken: string
  refreshToken: string
  expiryDuration: number
}

export interface LogoutBodyType {
  deviceInfo: DeviceInfoType
  token: string
}

export type LogoutResponseType = Pick<ResponseMainType, 'success' | 'message'>
export type RegisterResponseType = LogoutResponseType

// UI related types
export interface CommonButtonType {
  id: ID
  title: string
  icon?: React.ReactNode
  url: string
  count?: number
}

export type FormState =
  | {
      errors?: Record<string, string[]>
      message?: string
      payload?: any
    }
  | undefined

// File related types
export interface UploadFileResponseType {
  filename: string
  contentType: string
  fileSize: number
  createdTime: string
}

// API related types
export type CustomOptions = Omit<RequestInit, 'method'> & {
  baseUrl?: string
}

// Response types
export interface PostTypeResponse extends ResponseMainType {
  details: PostType
}

export interface TopUserType {
  userId: string
  username: string
  postCount: number
  totalFavorites: number
  followType: string
  avatarUrl: string
}

export type ListPostTypeResponse = PaginatedResponse<PostType>
export type AccountResponseType = ResponseMainType & { details: AccountType }
export type TopUsersResponseType = ResponseMainType & { details: TopUserType[] }
export type TagsResponseType = ResponseMainType & { details: string[] }
export type ErrorResponseType = ResponseMainType & { error: any }
export type CategoryResponseType = PaginatedResponse<Category>
