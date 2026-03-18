import CCT from './CCT';
import chedochinhsach from './chedochinhsach';
import chinhtritutuong from './chinhtritutuong';
import danhmuc from './danhmuc';
import danhmucchinhsach from './danhmucchinhsach';
import dichvuhanhchinh from './dichvuhanhchinh';
import diemrenluyen from './diemrenluyen';
import donvihanhchinh from './donvihanhchinh';
import login from './login';
import loptinchi from './loptinchi';
import namhoc from './namhoc';
import phuvucongdong from './phuvucongdong';
import sinhvien from './sinhvien';
import sukien from './sukien';
import thongbao from './thongbao';
import thongkebaocao from './thongkebaocao';
import thongtinnguoihoc from './thongtinnguoihoc';
import trangchu from './trangchu';
import vanhoathethao from './vanhoathethao';

export default {
	...login,
	...sinhvien,
	...namhoc,
	...trangchu,
	...donvihanhchinh,
	...loptinchi,
	...thongtinnguoihoc,
	...danhmuc,
	...thongbao,
	...chinhtritutuong,
	...CCT,
	...danhmucchinhsach,
	...thongkebaocao,
	...phuvucongdong,
	...vanhoathethao,
	...chedochinhsach,
	...dichvuhanhchinh,
	...sukien,
	...diemrenluyen,

	'pages.trangchu.title': 'PHÂN HỆ CÔNG TÁC SINH VIÊN',
	'pages.trangchu.subtitle': 'HỆ THỐNG ĐẠI HỌC SỐ',
	'pages.gioithieu.title': 'GIỚI THIỆU',
	'pages.gioithieu.subtitle': 'HỆ THỐNG ĐẠI HỌC SỐ',
};
