import type { ECurrency, EMaDoiTuongApDung } from '@/services/constant';

declare module MucThuTaiChinh {
	export interface IRecord extends Partial<Record<EMaDoiTuongApDung>, string>, Partial<Record<EMaDinhKy>, string> {
		_id: string;
		currency: ECurrency;
		unitAmount: number;
		ma: string;
		name: string;
		vietTat?: string;
		maKhoanThu: string;
		khoanThu: KhoanThu.Record;
		active: boolean;
		moTa?: string;
		metaData?: any;
		mucThu?: number[];

		donViHanhChinh?: string;
		vaiTro?: string;
		hocHam?: string;
		hocVi?: string;
	}
}
