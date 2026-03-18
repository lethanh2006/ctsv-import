import CCT from './CCT';
import danhmuc from './danhmuc';
import login from './login';

export default {
	...login,
	...danhmuc,
	...CCT,

	'pages.trangchu.title': 'STUDENT AFFAIRS MANAGEMENT',
	'pages.trangchu.subtitle': 'DIGITAL UNIVERSITY SYSTEM',
	'pages.gioithieu.title': 'ABOUT',
	'pages.gioithieu.subtitle': 'DIGITAL UNIVERSITY SYSTEM',
};
