import type { Access, FieldAccess } from 'payload'

export const isAdmin: Access = ({ req: { user } }) => Boolean(user)

export const isAdminFieldLevel: FieldAccess = ({ req: { user } }) => Boolean(user)
