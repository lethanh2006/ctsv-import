declare module VanBan {
	export interface IRecord {
		ten: string;
		ma: string;
		url: string;
		tags: string[] | string;
		[key: string]: any;
	}
}
