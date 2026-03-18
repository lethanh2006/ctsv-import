import type { ENguonSinhMa } from './constant';

declare module SinhMaTuDong {
	export interface ISoThuTu {
		_id: string;
		name: string; // 'HOC_PHAN_TRINH_DO_DON_VI|7|12.01';
		count: number;
		source: ENguonSinhMa;

		createdAt?: string;
		updatedAt?: string;
	}

	export interface IQuyTac {
		_id: string;
	}
}
