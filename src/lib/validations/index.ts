import * as z from "zod"

export const SignupValidation = z.object({
  email: z.string().email(),
  name: z.string().min(3, { message: 'Too short'}),
  username: z.string().min(3, { message: 'Too short' }).max(50),
  password: z.string().min(8, { message: 'Too short' }),
})

export const SigninValidation = z.object({
  email: z.string().email(),
  password: z.string().min(8, { message: 'Too short' }),
})

export const PostValidation = z.object({
  caption: z.string().min(5).max(200),
  file: z.custom<File[]>(),
  location: z.string().min(2).max(100),
  tags: z.string()
})
