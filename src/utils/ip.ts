import { AppModules, EModuleKey } from '@/services/base/constant';

const ipRoot = APP_CONFIG_IP_ROOT; // ip dev

// Ip Chính => Mặc định dùng trong các useInitModel
const ip3 = ipRoot + 'slink'; // ip dev
// const ip3 = 'http://192.168.1.38:3000'; // ip dev

// Ip khác
const ipNotif = ipRoot + 'notification'; // ip dev
const ipDaoTao = ipRoot + 'qldt';
const ipNhanSu = ipRoot + 'tcns';
const ipCore = ipRoot + 'core';
const ipTaiChinh = ipRoot + 'tai-chinh-api-v2';
const ipSlink = ipRoot + 'slink'; // ip dev
const ipCCT = ipRoot + 'co-curriculum'; // ip dev
// const ipCCT = 'http://192.168.1.146:3010'; // ip dev
const ipCsvc = ipRoot + 'csvc';
// const ipCCT = 'http://192.168.1.38:3010'; // ip dev
const ipKhaoThi = ipRoot + 'khao-thi';

const currentRole = EModuleKey.CTSV;
const replaceRole: EModuleKey | undefined = undefined; //EModuleKey.CONG_CAN_BO; // Thay đổi theo từng phân hệ
const oneSignalRole = EModuleKey.CONG_CAN_BO;

// DO NOT TOUCH
const keycloakClientID = AppModules[currentRole].clientId;
const keycloakAuthority = APP_CONFIG_KEYCLOAK_AUTHORITY;
const resourceServerClientId = `${APP_CONFIG_PREFIX_OF_KEYCLOAK_CLIENT_ID}auth`;
const keycloakAuthEndpoint = APP_CONFIG_KEYCLOAK_AUTHORITY + '/protocol/openid-connect/auth';
const keycloakTokenEndpoint = APP_CONFIG_KEYCLOAK_AUTHORITY + '/protocol/openid-connect/token';
const keycloakUserInfoEndpoint = APP_CONFIG_KEYCLOAK_AUTHORITY + '/protocol/openid-connect/userinfo';
const sentryDSN = APP_CONFIG_SENTRY_DSN;
const oneSignalClient = APP_CONFIG_ONE_SIGNAL_ID;

export {
	currentRole,
	ip3,
	ipCCT,
	ipCore,
	ipCsvc,
	ipDaoTao,
	ipKhaoThi,
	ipNhanSu,
	ipNotif,
	ipSlink,
	ipTaiChinh,
	keycloakAuthEndpoint,
	keycloakAuthority,
	keycloakClientID,
	keycloakTokenEndpoint,
	keycloakUserInfoEndpoint,
	oneSignalClient,
	oneSignalRole,
	replaceRole,
	resourceServerClientId,
	sentryDSN,
};
