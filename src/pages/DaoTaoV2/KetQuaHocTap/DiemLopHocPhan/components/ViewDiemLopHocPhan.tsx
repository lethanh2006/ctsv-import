import type { LopHocPhan } from '@/services/DaoTaoV2/HocKy/LopHocPhan/typing';
import { colorTrangThaiHocSv, ETrangThaiHocSv, localeTrangThaiHocSv } from '@/services/DaoTaoV2/SinhVien/constant';
import { resetFieldsForm } from '@/utils/utils';
import { EditOutlined } from '@ant-design/icons';
import { Button, Descriptions, Form, Modal, Spin, Tag } from 'antd';
import { useEffect } from 'react';
import { useIntl, useModel } from 'umi';
import DesDiemLopHocPhan from './DesDiemLopHocPhan';
// import DesDiemLopHocPhan from './DesDiemLopHocPhan';
// import FormCapNhatDiem from './FormCapNhatDiem';

const ViewDiemLopHocPhan = (props: {
	visible: boolean;
	setVisible: (vis: boolean) => void;
	sinhVienLopHocPhanId?: string;
	diemHpSvHkId?: string;
	hasEdit?: boolean;
	getData?: () => void;
}) => {
	const intl = useIntl();
	const { visible, setVisible, sinhVienLopHocPhanId, diemHpSvHkId, hasEdit, getData } = props;
	const { record, getByIdModel, loading } = useModel('daotaov2.hocky.sinhvienlophocphan');
	const {
		record: recDiem,
		getByIdModel: getDiemHpSvHk,
		setRecord: setDiem,
		edit,
		setEdit,
		putModel,
		formSubmiting,
		loading: loadingDiem,
	} = useModel('daotaov2.ketquahoctap.diemhpsvhk');
	const { getModel: getDauDiem, danhSach: danhSachDauDiem } = useModel('daotaov2.danhmuc.daudiemhocphan');
	const [form] = Form.useForm();
	const recSinhVien = diemHpSvHkId ? recDiem?.sinhVien : record?.sinhVien;
	const recHocPhan = diemHpSvHkId ? recDiem?.hocPhan : record?.lopHocPhan?.hocPhan;

	useEffect(() => {
		if (!danhSachDauDiem.length) getDauDiem();
	}, []);

	useEffect(() => {
		if (visible && sinhVienLopHocPhanId) getByIdModel(sinhVienLopHocPhanId).then((res) => setDiem(res.diemHpSvHk));
	}, [visible, sinhVienLopHocPhanId]);

	useEffect(() => {
		if (visible && diemHpSvHkId) getDiemHpSvHk(diemHpSvHkId); //.then((diemLHP) => getLopHocPhan(diemLHP.lopHocPhanId));
	}, [visible, diemHpSvHkId]);

	useEffect(() => {
		if (edit && recDiem?._id) resetFieldsForm(form, recDiem);
	}, [edit]);

	const handleCancel = () => {
		setEdit(false);
		setVisible(false);
	};

	const onFinish = (values: LopHocPhan.IDiemHpSvHk) => {
		if (recDiem?._id)
			putModel(recDiem._id, values, () => getDiemHpSvHk(recDiem._id)).then((res) => {
				setDiem(res);
				if (getData) getData();
				setEdit(false);
			});
	};

	const renderTrangThaiSinhVien = () => {
		const status = recSinhVien?.trangThaiHoc;
		return status ? (
			<Tag color={colorTrangThaiHocSv[status as ETrangThaiHocSv]}>
				{intl.formatMessage({ id: localeTrangThaiHocSv[status as ETrangThaiHocSv] })}
			</Tag>
		) : null;
	};

	return (
		<Modal
			open={visible}
			onCancel={handleCancel}
			title={intl.formatMessage({ id: 'ketquahoctap.ketquahocphan.thongtindiemhocphan' })}
			width={800}
			footer={null}
		>
			<Descriptions style={{ marginBottom: 16 }}>
				<Descriptions.Item label={intl.formatMessage({ id: 'ketquahoctap.ketquahocphan.masv' })}>
					{recSinhVien?.ma}
				</Descriptions.Item>
				<Descriptions.Item label={intl.formatMessage({ id: 'ketquahoctap.ketquahocphan.hoten' })}>
					{recSinhVien?.ten}
				</Descriptions.Item>
				<Descriptions.Item label={intl.formatMessage({ id: 'ketquahoctap.ketquahocphan.trangthaisv' })}>
					{renderTrangThaiSinhVien()}
				</Descriptions.Item>

				<Descriptions.Item label={intl.formatMessage({ id: 'ketquahoctap.ketquahocphan.mahocphan' })}>
					{recHocPhan?.ma ?? ''}
				</Descriptions.Item>
				<Descriptions.Item label={intl.formatMessage({ id: 'ketquahoctap.ketquahocphan.tenhocphan' })} span={2}>
					{recHocPhan?.ten}
				</Descriptions.Item>
				<Descriptions.Item label={intl.formatMessage({ id: 'ketquahoctap.ketquahocphan.sotinchi' })}>
					{intl.formatMessage({ id: 'ketquahoctap.ketquahocphan.sotinchi_value' }, { 0: recHocPhan?.soTinChi ?? '' })}
				</Descriptions.Item>
				<Descriptions.Item label={intl.formatMessage({ id: 'ketquahoctap.ketquahocphan.loptinchi' })}>
					{recDiem?.isCongNhanQuyDoiDiem
						? intl.formatMessage({ id: 'ketquahoctap.ketquahocphan.diemquydoi' })
						: (recDiem?.tenLopHocPhan ?? record?.lopHocPhan?.ten)}
				</Descriptions.Item>
			</Descriptions>

			{!edit ? (
				<Spin spinning={loading || loadingDiem}>
					<DesDiemLopHocPhan />

					<div className='form-footer' style={{ marginTop: 18 }}>
						{hasEdit && recDiem?._id ? (
							<Button icon={<EditOutlined />} type='primary' onClick={() => setEdit(true)}>
								{intl.formatMessage({ id: 'ketquahoctap.ketquahocphan.capnhatdiem' })}
							</Button>
						) : null}
						<Button onClick={handleCancel}>{intl.formatMessage({ id: 'global.button.dong' })}</Button>
					</div>
				</Spin>
			) : (
				<Form form={form} layout='vertical' onFinish={onFinish}>
					{/* <FormCapNhatDiem /> */}

					<div className='form-footer' style={{ marginTop: 18 }}>
						<Button type='primary' htmlType='submit' loading={formSubmiting}>
							{intl.formatMessage({ id: 'global.button.luulai' })}
						</Button>
						<Button onClick={() => setEdit(false)}>{intl.formatMessage({ id: 'global.button.huy' })}</Button>
					</div>
				</Form>
			)}
		</Modal>
	);
};

export default ViewDiemLopHocPhan;
