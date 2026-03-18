import { TrangThaiTiepNhan } from '@/services/QuyTrinhDong/KhaiBaoQuyTrinh/constants';
import rules from '@/utils/rules';
import { Button, Form, Select } from 'antd';
import { useModel } from 'umi';

const FormInHoSo = (props: { handleCancel: any; currentStep: number; fixedCurrent?: number; setFixedCurrent: any }) => {
	const [form] = Form.useForm();
	const {
		dataQuyTrinh: recordVal,
		exportMauDonTheoBuocModel,
		exportMauTraKetQuaTheoBuocModel,
	} = useModel('quytrinh.khaibaoquytrinh');
	const buocHienTai =
		recordVal?.danhSachBuocXuLy?.[
			props?.fixedCurrent !== null && props.fixedCurrent !== undefined ? props.fixedCurrent : props.currentStep
		];
	const formKhai = recordVal?.quyTrinh?.danhSachFormKhaiBao?.find((item) => item.ma === buocHienTai?.maFormKhaiBao);
	const formTiepNhan = recordVal?.quyTrinh?.danhSachFormTiepNhan?.find(
		(item) => item.ma === buocHienTai?.maFormTiepNhan,
	);
	const option = [];
	if (formKhai?.fileId) {
		option.push({
			value: 1,
			label: 'Mẫu đơn',
		});
	}
	if (buocHienTai?.trangThaiTiepNhan === TrangThaiTiepNhan.DA_DUYET && formTiepNhan?.fileId) {
		option.push({
			value: 2,
			label: 'Mẫu trả kết quả',
		});
	}

	return (
		<Form
			form={form}
			onFinish={(values) => {
				if (values?.loaiHoSo === 1) {
					exportMauDonTheoBuocModel(recordVal?._id ?? '', buocHienTai?.ma ?? '', formKhai?.ten ?? '');
				} else {
					exportMauTraKetQuaTheoBuocModel(recordVal?._id ?? '', buocHienTai?.ma ?? '', formTiepNhan?.ten ?? '');
				}
			}}
			layout={'vertical'}
		>
			<Form.Item initialValue={option?.[0]?.value} label={'Loại hồ sơ'} name={'loaiHoSo'} rules={[...rules.required]}>
				<Select placeholder='Chọn loại' options={option} />
			</Form.Item>

			<Form.Item>
				<div style={{ display: 'flex', justifyContent: 'center' }}>
					<Button style={{ marginRight: 8 }} type={'primary'} htmlType={'submit'}>
						In hồ sơ
					</Button>
					<Button
						onClick={() => {
							props.handleCancel();
							props.setFixedCurrent(undefined);
						}}
					>
						Đóng
					</Button>
				</div>
			</Form.Item>
		</Form>
	);
};

export default FormInHoSo;
