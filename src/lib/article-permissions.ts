interface EditorialUser {
  id: string;
  role: string;
  isBlocked?: boolean;
}
interface EditorialArticle {
  authorId: string;
  status: string;
}
export function isEditorialRole(role: string): boolean {
  return role === 'ADMIN' || role === 'EDITOR';
}
export function canReadEditorialArticle(user: EditorialUser | null, article: EditorialArticle): boolean {
  if (!user || user.isBlocked) return false;
  return isEditorialRole(user.role) || (user.role === 'AUTHOR' && article.authorId === user.id);
}
export function canEditArticle(user: EditorialUser | null, article: EditorialArticle): boolean {
  if (!user || user.isBlocked) return false;
  return isEditorialRole(user.role) || (user.role === 'AUTHOR' && article.authorId === user.id && ['DRAFT', 'IN_REVIEW'].includes(article.status));
}
export function canWriteGlossary(user: EditorialUser | null): boolean {
  return Boolean(user && !user.isBlocked && isEditorialRole(user.role));
}
