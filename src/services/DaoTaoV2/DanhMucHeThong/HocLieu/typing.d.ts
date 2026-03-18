declare module HocLieu {
	export interface IRecord {
		_id: string;
		ten: string;
		ma: string;
		loaiHocLieu: string;
		tacGia: string;
		url: string;
		createdAt?: string;
		updatedAt?: string;
	}

	// Tinh Van
	export interface IRecordThuVien {
		ID: number; // 4899;
		product_code: string; // 'HVPN230040161';
		product_title: string; // 'Sách giáo khoa Hóa học 5';
		api_detail: string; // 'http://media.tinhvan.com/apihvpn/api/synchronize/get.json/item?id=4899';
		link_opac: string; // 'http://media.tinhvan.com/opachvpn/Detail.aspx?id=4899';
		author: string; // 'Trần Văn Khánh';
		publish_name: string; // 'Giáo dục';
		publish_year: string; // '2023';
		product_description: any;
		is_opac: number; // 0;
		type_of_book: 'item' | 'edata';
		product_thumb: any;
		category_type: any;
		product_price: number;
	}
}
