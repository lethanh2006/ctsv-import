export enum EMaTrangThaiThanhToan {
	CHUA_THANH_TOAN = 'open',
	CHUA_THANH_TOAN_DU = 'underpaid',
	DA_THANH_TOAN_DU = 'paid',
	DONG = 'closed',
}

export const ETrangThaiThanhToan = {
	[EMaTrangThaiThanhToan.CHUA_THANH_TOAN]: 'Chưa thanh toán',
	[EMaTrangThaiThanhToan.CHUA_THANH_TOAN_DU]: 'Chưa thanh toán đủ',
	[EMaTrangThaiThanhToan.DA_THANH_TOAN_DU]: 'Đã thanh toán đủ',
	[EMaTrangThaiThanhToan.DONG]: 'Đóng',
};

export const EMauTrangThaiThanhToanTable = {
	[EMaTrangThaiThanhToan.CHUA_THANH_TOAN]: 'red',
	[EMaTrangThaiThanhToan.CHUA_THANH_TOAN_DU]: 'gold',
	[EMaTrangThaiThanhToan.DA_THANH_TOAN_DU]: 'green',
	[EMaTrangThaiThanhToan.DONG]: undefined,
};

export enum EMaDoiTuongApDung {
	// CO_SO_DAO_TAO = 'coSoDaoTao',
	TRINH_DO_DAO_TAO = 'trinhDoDaoTao',
	HINH_THUC_DAO_TAO = 'hinhThucDaoTao',
	KHOA = 'khoa',
	NIEN_KHOA = 'nienKhoa',
	NGANH = 'nganh',
	NAM_HOC = 'namHoc',
	HOC_KY = 'hocKy',
	LOP_HANH_CHINH = 'lopHanhChinh',
	LOP_TIN_CHI = 'lopTinChi',
	// NGUOI_DUNG_CU_THE = 'nguoiDungCuThe',
}

export enum ECurrency {
	VND = 'VND',
	USD = 'USD',
	EUR = 'EUR',
}

// Khoản thu mặc định
export enum EMaKhoanThuMacDinh {
	HOC_PHI = '01.01',
}

//Giao dịch
export enum ETransactionType {
	DEPOSIT = 'deposit',
	WITHDRAW = 'withdraw',
	INTERNAL = 'internal',
}

export enum ETransactionPaymentType {
	BANK = 'bank',
	MANUAL = 'manual',
	MOMO_WALLET = 'momo-wallet',
}

export const transactionPaymentLabel: Record<ETransactionPaymentType, string> = {
	[ETransactionPaymentType.BANK]: 'Chuyển khoản ngân hàng',
	[ETransactionPaymentType.MANUAL]: 'Thủ công',
	[ETransactionPaymentType.MOMO_WALLET]: 'Ví Momo',
};

export enum ETransactionSourceType {
	EXTERNAL = 'external',
	WALLET = 'wallet',
	SYSTEM = 'system',
}

export enum ETransactionStatus {
	PENDING = 'pending',
	SUCCESS = 'success',
	FAIL = 'fail',
	CANCEL = 'cancel',
}

export const transactionStatus: Record<ETransactionStatus, string> = {
	[ETransactionStatus.PENDING]: 'Đang xử lý',
	[ETransactionStatus.SUCCESS]: 'Thành công',
	[ETransactionStatus.FAIL]: 'Không thành công',
	[ETransactionStatus.CANCEL]: 'Đã hủy',
};

export const colorTransactionStatus: Record<ETransactionStatus, string> = {
	[ETransactionStatus.PENDING]: 'blue',
	[ETransactionStatus.SUCCESS]: 'green',
	[ETransactionStatus.FAIL]: 'red',
	[ETransactionStatus.CANCEL]: 'default',
};
