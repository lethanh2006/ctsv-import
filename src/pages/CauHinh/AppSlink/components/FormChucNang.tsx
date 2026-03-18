import { Button, Form } from 'antd';
import { useModel } from 'umi';
import { useEffect } from 'react';
import { SettingKey } from '../../constants';
import ChucNangTable from '@/pages/CauHinh/AppSlink/components/TableChucNang';

interface Props {
	isGiangVien?: boolean;
}

const ChucNang = ({ isGiangVien }: Props) => {
	const { fetchSettingMapModel, settingMap, updateSettingModel } = useModel('quantri.cauhinh');
	const [form] = Form.useForm();

	const getData = async () => {
		try {
			if (isGiangVien) {
				fetchSettingMapModel(SettingKey.CHUC_NANG_APP_GV).then(() => {
					form.setFieldsValue({ [SettingKey.CHUC_NANG_APP_GV]: settingMap?.CHUC_NANG_APP_GV?.value ?? [] });
				});
			} else {
				fetchSettingMapModel(SettingKey.CHUC_NANG_APP_SV).then(() => {
					form.setFieldsValue({ [SettingKey.CHUC_NANG_APP_SV]: settingMap?.CHUC_NANG_APP_SV?.value ?? [] });
				});
			}
		} catch (e) {
			console.log(e);
		}
	};

	const onFinish5 = async (value: any) => {
		try {
			const valuesConvert = isGiangVien ? value?.[SettingKey.CHUC_NANG_APP_GV] : value?.[SettingKey.CHUC_NANG_APP_SV];
			Promise.all([
				updateSettingModel({
					key: isGiangVien ? SettingKey.CHUC_NANG_APP_GV : SettingKey.CHUC_NANG_APP_SV,
					value: valuesConvert,
					// noNotif: true,
				}),
			]).then(() => {
				getData();
			});

			// updateSettingModel({
			// 	key: SettingKey.AUTO_SAVE_BAI_LAM,
			// 	value:valuesConvert,
			// }).then(() => {
			// 	getData();
			// });
		} catch (e) {
			console.log(e);
		}
	};

	useEffect(() => {
		getData();
	}, []);

	return (
		<>
			<Form onFinish={onFinish5} layout={'vertical'} form={form}>
				{isGiangVien && (
					<Form.Item name={[SettingKey.CHUC_NANG_APP_GV]}>
						<ChucNangTable form={form} fieldName={SettingKey.CHUC_NANG_APP_GV} />
					</Form.Item>
				)}
				{!isGiangVien && (
					<Form.Item name={[SettingKey.CHUC_NANG_APP_SV]}>
						<ChucNangTable form={form} fieldName={SettingKey.CHUC_NANG_APP_SV} />
					</Form.Item>
				)}

				<div className='form-footer'>
					<Button htmlType='submit' type='primary'>
						Lưu lại
					</Button>
				</div>
			</Form>
		</>
	);
};
export default ChucNang;
