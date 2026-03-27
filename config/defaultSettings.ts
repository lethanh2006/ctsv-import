import { Settings as LayoutSettings } from '@ant-design/pro-layout';

const appBasePath = process.env.APP_CONFIG_BASE_PATH || '/';

const defaultSettings: LayoutSettings & {
	logo?: string;
	siderWidth: number;
} = {
	navTheme: 'light',
	layout: 'side',
	contentWidth: 'Fluid',
	fixedHeader: true,
	fixSiderbar: true,
	colorWeak: true,
	logo: `${appBasePath}logo.png`,
	iconfontUrl: '',
	siderWidth: 260,
};

export default defaultSettings;
