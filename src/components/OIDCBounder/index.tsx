import { useAuthActions } from '@/hooks/useAuthActions';
import { getPermission, getUserInfo } from '@/services/base/api';
import { AppModules } from '@/services/base/constant';
import { type Login } from '@/services/base/typing';
import axios from '@/utils/axios';
import { currentRole, replaceRole } from '@/utils/ip';
import { oidcConfig } from '@/utils/oidcConfig';
import { notification } from 'antd';
import queryString from 'query-string';
import { useEffect, type FC } from 'react';
import { AuthProvider, hasAuthParams, useAuth } from 'react-oidc-context';
import { history, useIntl, useModel } from 'umi';
import LoadingPage from '../Loading';
import { unAuthPaths, unCheckPermissionPaths } from './constant';

let OIDCBounderHandlers: ReturnType<typeof useAuthActions> | null = null;
const POST_LOGIN_PATH_STORAGE_KEY = 'oidc_post_login_path';
const appBasePath = APP_CONFIG_BASE_PATH.endsWith('/') ? APP_CONFIG_BASE_PATH.slice(0, -1) : APP_CONFIG_BASE_PATH;
const buildAppPath = (path: string) => `${appBasePath}${path.startsWith('/') ? path : `/${path}`}`;
const oidcCallbackPath = buildAppPath('/auth/callback');
const defaultAfterLoginPath = buildAppPath('/dashboard');

const isBasePath = (pathname: string) => pathname === appBasePath || pathname === `${appBasePath}/`;
const isLoginPath = (pathname: string) => pathname === buildAppPath('/user/login');
const isCallbackPath = (pathname: string) => pathname === oidcCallbackPath;

const rememberPostLoginPath = () => {
	const redirectTarget =
		isBasePath(window.location.pathname) || isLoginPath(window.location.pathname) || isCallbackPath(window.location.pathname)
			? defaultAfterLoginPath
			: `${window.location.pathname}${window.location.search}${window.location.hash}`;

	try {
		sessionStorage.setItem(POST_LOGIN_PATH_STORAGE_KEY, redirectTarget);
	} catch (error) {
		console.error('[OIDC] Failed to store post login path', error);
	}
};

const consumePostLoginPath = () => {
	try {
		const path = sessionStorage.getItem(POST_LOGIN_PATH_STORAGE_KEY);
		sessionStorage.removeItem(POST_LOGIN_PATH_STORAGE_KEY);
		return path || defaultAfterLoginPath;
	} catch (error) {
		console.error('[OIDC] Failed to read post login path', error);
		return defaultAfterLoginPath;
	}
};

export const OIDCBounder_: FC<{ children: React.ReactElement }> = ({ children }) => {
	const intl = useIntl();
	const { setInitialState, initialState } = useModel('@@initialState');
	const auth = useAuth();
	const actions = useAuthActions();
	const isUnauth = unAuthPaths.some((path) => window.location.pathname.includes(path));

	const handleAxios = (access_token: string) => {
		axios.defaults.headers.common.Authorization = `Bearer ${access_token}`;
	};

	const redirectLocation = () => {
		// Loại bỏ các Auth params
		const { code, iss, session_state, state, ...other } = queryString.parse(window.location.search);
		let newSearch = Object.keys(other)
			.map((key) => `${key}=${other[key]}`)
			.join('&');
		if (newSearch) newSearch = '?' + newSearch;
		const pathname =
			isBasePath(window.location.pathname) || isLoginPath(window.location.pathname) || isCallbackPath(window.location.pathname)
				? consumePostLoginPath()
				: `${window.location.pathname}${newSearch}${window.location.hash}`;
		window.location.replace(pathname);
	};

	const handleLogin = async () => {
		if (auth.user) {
			handleAxios(auth.user.access_token);
			try {
				const [getPermissionsResponse, getUserInfoResponse] = await Promise.all([getPermission(), getUserInfo()]);
				const userInfo: Login.IUser = getUserInfoResponse?.data;
				const permissions: Login.IPermission[] = getPermissionsResponse.data;
				const isUncheckPath = unCheckPermissionPaths.some((path) => window.location.pathname.includes(path));
				const hasRole = permissions.some((item) => item.rsname === currentRole);
				const tmpInitialState = {
					currentUser: { ...userInfo, ssoId: userInfo.sub },
					authorizedPermissions: permissions,
				};

				// Ensure permission is fully set before marking as loaded
				setInitialState((prev) => ({
					...prev,
					...tmpInitialState,
				}));

				// Persist minimal initial state so reload won't lose permissions immediately
				try {
					sessionStorage.setItem('initialState', JSON.stringify(tmpInitialState));
				} catch (e) {}

				// Use setTimeout to ensure state update is completed before setting permissionLoading to false
				setTimeout(() => {
					setInitialState((prev) => ({ ...prev, permissionLoading: false }));
				}, 0);

				if (!isUncheckPath && currentRole && permissions.length && !hasRole) {
					const hasReplaceRole = permissions.some((item) => item.rsname === replaceRole);
					const linkReplace = !!replaceRole && AppModules[replaceRole]?.url;

					if (!!linkReplace && hasReplaceRole) {
						window.location.replace(linkReplace);
						return;
					}
					history.replace('/403');
				} else {
					if (isBasePath(window.location.pathname) || isLoginPath(window.location.pathname) || isCallbackPath(window.location.pathname))
						redirectLocation();
				}
			} catch {
				if (auth.isAuthenticated) auth.removeUser();
				else {
					notification.warning({
						message: intl.formatMessage({ id: 'global.OIDCBounder.message' }),
						description: intl.formatMessage({ id: 'global.OIDCBounder.description' }),
					});
					history.replace('/user/login');
				}
			}
		} else history.replace('/user/login');
	};

	useEffect(() => {
		// Nếu đang cập nhật thì bật cái này lên
		// history.replace('/hold-on');
		// return;

		// Trong trường hợp các trang Public muốn đăng nhập thì dùng
		// <Button onClick={() => signinPopup()}>Đăng nhập</Button>
		// Sau khi đăng nhập popup sẽ nhảy về đây và xử lý như bình thường

		if (auth.isLoading) return;

		// Chưa login + chưa có auth params ==> Cần redirect keycloak để lấy auth params + cookie
		if (!hasAuthParams() && !auth.isAuthenticated && initialState?.permissionLoading) {
			if (!isUnauth) {
				rememberPostLoginPath();
				auth.signinRedirect();
			}
			return;
		}

		// Đã login => Xoá toàn bộ auth params được sử dụng để login trước đó
		if (auth.isAuthenticated) {
			if (hasAuthParams()) redirectLocation();
			else handleLogin();
		}
	}, [auth.isAuthenticated, auth.isLoading]);

	useEffect(() => {
		if (auth.user?.access_token) handleAxios(auth.user.access_token);
	}, [auth.user?.access_token]);

	useEffect(() => {
		if (auth.error) {
			console.error('[OIDC] Authentication error', {
				error: auth.error,
				href: window.location.href,
				hasAuthParams: hasAuthParams(),
				isAuthenticated: auth.isAuthenticated,
			});
		}
	}, [auth.error, auth.isAuthenticated]);

	useEffect(() => {
		OIDCBounderHandlers = actions;
	}, [actions]);

	return <>{(auth.isLoading || initialState?.permissionLoading) && !isUnauth ? <LoadingPage /> : children}</>;
};

export const OIDCBounder: FC<{ children: React.ReactElement }> & { getActions: () => typeof OIDCBounderHandlers } = (
	props,
) => {
	return (
		<AuthProvider
			{...oidcConfig}
			redirect_uri={`${window.location.origin}${oidcCallbackPath}`}
			onSigninCallback={() => {
				window.history.replaceState({}, document.title, consumePostLoginPath());
			}}
		>
			<OIDCBounder_ {...props} />
		</AuthProvider>
	);
};

OIDCBounder.getActions = () => OIDCBounderHandlers;
