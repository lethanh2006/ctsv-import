import CCT from './CCT';
import danhmuc from './danhmuc';
import login from './login';
import sinhvien from './sinhvien';
import thongtinnguoihoc from './thongtinnguoihoc';

export default {
	...login,
	...danhmuc,
	...CCT,
	...thongtinnguoihoc,
	...sinhvien,

	'pages.trangchu.title': 'STUDENT AFFAIRS MANAGEMENT',
	'pages.trangchu.subtitle': 'DIGITAL UNIVERSITY SYSTEM',
	'pages.gioithieu.title': 'ABOUT',
	'pages.gioithieu.subtitle': 'DIGITAL UNIVERSITY SYSTEM',
};
