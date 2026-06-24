export declare module MiniApp {
	export interface IRecord {
		_id: string;
		ten: string;
		danhMucId: string;
		donViTrienKhai: string;
		moTa: string;
		icon: string;
		urlBanner: string;
		urlMiniApp: string;
		isActive: boolean;
		tokenKey: string;
		tokenValue: string;
	}
}

export declare module MiniAppDanhMuc {
	export interface IRecord {
		_id: string;
		ten: string;
		icon: string;
		isActive: boolean;
		moTa?: string;
	}
}
