import useInitModel from '@/hooks/useInitModel';
import { useState } from 'react';
import { message } from 'antd';
import type { SettingKey } from '@/pages/CauHinh/constants';
import { createSetting, getByKey, update } from '@/services/QuanTri';

export default () => {
	const objInit = useInitModel<any>('setting');

	const [settingMap, setSettingMap] = useState<Record<SettingKey, any>>({} as any);

	const fetchSettingMapModel = async (key: SettingKey, cb?: (res: any) => void) => {
		try {
			const response = await getByKey(key);
			const data = response?.data?.data;
			const value = response?.data?.data?.value;
			setSettingMap(Object.assign(settingMap, { [key]: { value: value, _id: data?._id } }));
			if (cb) {
				cb(value);
			}
			return value;
		} catch (err) {
			// TODO
		} finally {
		}
	};

	const updateSettingModel = async (payload: { key: string; value: any; noNotif?: boolean }) => {
		try {
			if (settingMap?.[payload?.key as SettingKey]?._id) {
				await update(settingMap?.[payload?.key as SettingKey]?._id, payload);
			} else {
				await createSetting(payload);
			}

			if (!payload?.noNotif) message.success('Lưu thành công');
			// fetchSettingMapModel(payload.key as SettingKey);
		} catch (err) {
			message.error('Lưu cấu hình gặp lỗi');
			// TODO
		} finally {
		}
	};

	return {
		...objInit,
		fetchSettingMapModel,
		setSettingMap,
		settingMap,
		updateSettingModel,
	};
};
