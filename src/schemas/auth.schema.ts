import { z } from 'zod'

// Common schemas
const nameSchema = z.string().min(3).max(50)
const emailSchema = z.string().email().min(3).max(60)
const urlSchema = z.string().url({ message: 'Invalid URL. URL must start with http...' }).max(50)
const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters.')
  .max(20, 'Password must be at most 20 characters.')
  .regex(/(?=.*[A-Z])/, 'At least one uppercase character.')
  .regex(/(?=.*[a-z])/, 'At least one lowercase character.')
  .regex(/(?=.*\d)/, 'At least one digit.')
  .regex(/[$&+,:;=?@#|'<>.^*()%!-]/, 'At least one special character.')

const optionalStringOrEmpty = z.string().optional().or(z.literal(''))

// Device info schema
const deviceInfoSchema = z
  .object({
    deviceId: z.string(),
    deviceType: z.string()
  })
  .strict()
  .strip()

// Profile update schema
export const UpdateProfileSchema = z
  .object({
    name: nameSchema,
    avatarUrl: optionalStringOrEmpty,
    bio: z.string().min(5).max(300).optional().or(z.literal('')),
    website: urlSchema.optional().or(z.literal('')),
    twitter: urlSchema.optional().or(z.literal('')),
    github: urlSchema.optional().or(z.literal('')),
    location: z.string().min(5).max(100).optional().or(z.literal('')),
    linkedin: urlSchema.optional().or(z.literal(''))
  })
  .strict()
  .strip()

export type UpdateProfileType = z.infer<typeof UpdateProfileSchema>

// Password update schema
export const UpdatePasswordSchema = z
  .object({
    oldPassword: passwordSchema,
    newPassword: passwordSchema,
    confirmPassword: passwordSchema
  })
  .strict()
  .strip()
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Confirm password must match new password.',
    path: ['confirmPassword']
  })
  .refine((data) => data.oldPassword !== data.newPassword, {
    message: 'New password must be different from old password.',
    path: ['newPassword']
  })

export type UpdatePasswordType = z.infer<typeof UpdatePasswordSchema>

// Registration schema
export const FormRegisterSchema = z
  .object({
    name: nameSchema,
    email: emailSchema,
    password: passwordSchema
  })
  .strict()
  .strip()

export type RegisterBodyType = z.infer<typeof FormRegisterSchema>

// Login schema
export const FormLoginSchema = z
  .object({
    email: emailSchema,
    password: passwordSchema,
    deviceInfo: deviceInfoSchema
  })
  .strict()
  .strip()

export type LoginBodyType = z.infer<typeof FormLoginSchema>

// Google login schema
export const FormLoginGoogleSchema = z
  .object({
    code: z.string(),
    deviceInfo: deviceInfoSchema
  })
  .strict()
  .strip()

export type LoginGoogleBodyType = z.infer<typeof FormLoginGoogleSchema>

// New post schema
export const FormNewPostSchema = z
  .object({
    title: z.string().min(5, 'Title must be at least 5 characters.'),
    content: z.string().min(20, 'Content must be at least 20 characters.'),
    categoryId: z.string().min(1, 'Category is required.'),
    shortDescription: z.string().min(10).max(300),
    thumbnails: z.array(z.string()).min(1, 'Thumbnails is required.'),
    images: z.array(z.string()).optional(),
    tags: z.array(z.string()).min(1, 'Tags is required.').max(5, 'Tags must be at most 5 tags.')
  })
  .strict()
  .strip()

export type NewPostBodyType = z.infer<typeof FormNewPostSchema>

// Comment schema
export const FormCommentSchema = z
  .object({
    content: z.string().min(5, 'Comment must be at least 5 characters.'),
    postId: z.string(),
    parentCommentId: z.string().optional().or(z.literal(''))
  })
  .strict()
  .strip()

export type CommentBodyType = z.infer<typeof FormCommentSchema>
