// Shape Passport's JwtStrategy attaches to `req.user` after verifying a token.
// Lives in common (not the auth module) so any module's controller can import
// it for @CurrentUser() typing without depending on auth's internals.
export interface AuthenticatedUser {
  id: string;
  email: string;
  name: string;
}
