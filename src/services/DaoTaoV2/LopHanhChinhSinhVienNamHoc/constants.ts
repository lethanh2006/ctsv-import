export enum EVaiTroBanCanSuLop {
	// THANH_VIEN = 'thanh_vien',
	LOP_TRUONG = 'lop_truong',
	// LOP_PHO = 'lop_pho',
	LOP_PHO_DOI_SONG = 'lop_pho_doi_song',
	LOP_PHO_HOC_TAP = 'lop_pho_hoc_tap',
}

export const MapKeyColorVaiTroBanCanSuLop = {
	[EVaiTroBanCanSuLop.LOP_PHO_DOI_SONG]: '#28a745',
	[EVaiTroBanCanSuLop.LOP_TRUONG]: '#ff4d4f',
	[EVaiTroBanCanSuLop.LOP_PHO_HOC_TAP]: '#1890ff',
};
export const MapKeyNameVaiTroBanCanSuLop = {
	[EVaiTroBanCanSuLop.LOP_PHO_DOI_SONG]: 'Lớp phó đời sống',
	[EVaiTroBanCanSuLop.LOP_TRUONG]: 'Lớp trưởng',
	[EVaiTroBanCanSuLop.LOP_PHO_HOC_TAP]: 'Lớp phó học tập',
};
