// Anonymous display names for comments/ratings
export const ANONYMOUS_NAMES = [
    "Độc giả ẩn danh",
    "Người đọc bí ẩn",
    "Fan truyện",
    "Mọt sách",
    "Độc giả thầm lặng",
    "Người qua đường",
    "Book Lover",
    "Silent Reader",
    "Người yêu truyện",
    "Độc giả cuồng nhiệt",
] as const

export function isValidAnonymousName(name: string): boolean {
    return ANONYMOUS_NAMES.includes(name as any)
}
