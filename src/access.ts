import { tenTruongVietTatTiengAnh } from './services/base/constant';
import type { IInitialState } from './services/base/typing';
// import { currentRole } from './utils/ip';

/**
 * @see https://umijs.org/zh-CN/plugins/plugin-access
 * */
export default function access(initialState: IInitialState) {
	// const scopes = initialState.authorizedPermissions?.find((item) => item.rsname === currentRole)?.scopes;
	const scopes = initialState?.authorizedPermissions?.map((item) => item.scopes).flat();
	const roles = initialState?.currentUser?.realm_access?.roles?.map((item) => item);

	return {
		accessFilter: (route: any) => scopes?.includes(route?.maChucNang) || false,
		manyAccessFilter: (route: any) => route?.listChucNang?.some((role: string) => scopes?.includes(role)) || false,

		accessRolesFilter: (route: any) => roles?.includes(route?.maChucNang) || false,
		manyAccessRolesFilter: (route: any) => route?.listChucNang?.some((role: string) => roles?.includes(role)) || false,

		/** Co-curricular Activities (CCA) */
		cctFilter: () => tenTruongVietTatTiengAnh === 'VINUNI',

		vinuniAccessFilter: () => tenTruongVietTatTiengAnh === 'VINUNI',

		/** Có quyền truy cập chuẩn đầu ra CLO/PLO */
		cloPloAccessFilter: () => tenTruongVietTatTiengAnh !== 'VWA',

		minorAccessFilter: () => tenTruongVietTatTiengAnh === 'VINUNI',

		/** Có quyền truy cập Học bạ số */
		hocBaAccessFilter: (route?: any) =>
			tenTruongVietTatTiengAnh !== 'VWA' && (scopes?.includes(route?.maChucNang || 'qldt|sinh-vien|hoc-ba') || false),
	};
}
