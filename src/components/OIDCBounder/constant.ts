/** Path sẽ ko check auth (không nhảy sang màn đăng nhập)
 * Nhưng OIDC vẫn có thể check auth bằng signinSilent
 */
export const unAuthPaths = ['/notification', '/notification/check', '/qr-su-kien'];

export const unCheckPermissionPaths = ['/notification/subscribe'];
