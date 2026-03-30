import CCT from './CCT';
import activity from './CCT/activity';
import activityresult from './CCT/activityresult';
import danhmuc from './danhmuc';
import login from './login';

export default {
	...login,
	...danhmuc,
	...activity,
	...activityresult,
	...CCT,

	'pages.trangchu.title': 'STUDENT AFFAIRS MANAGEMENT SUBSYSTEM',
	'pages.trangchu.subtitle': 'COMMAND AND CONTROL SOFTWARE SYSTEM',
	'pages.gioithieu.title': 'ABOUT',
	'pages.gioithieu.subtitle': 'COMMAND AND CONTROL SOFTWARE SYSTEM',
};
