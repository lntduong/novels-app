import { UserRole } from '@prisma/client'

export function canManageUsers(role: UserRole): boolean {
    return role === 'SUPER_ADMIN' || role === 'ADMIN'
}

export function canManageContent(role: UserRole): boolean {
    return role === 'SUPER_ADMIN' || role === 'ADMIN' || role === 'EDITOR'
}

export function canViewDashboard(role: UserRole): boolean {
    return role === 'SUPER_ADMIN' || role === 'ADMIN' || role === 'EDITOR'
}

export function canPublishStory(role: UserRole): boolean {
    return role === 'SUPER_ADMIN' || role === 'ADMIN'
}

export function canAssignRole(currentRole: UserRole, targetRole: UserRole): boolean {
    // SUPER_ADMIN can assign any role
    if (currentRole === 'SUPER_ADMIN') return true

    // ADMIN cannot assign SUPER_ADMIN role
    if (currentRole === 'ADMIN' && targetRole !== 'SUPER_ADMIN') return true

    return false
}
