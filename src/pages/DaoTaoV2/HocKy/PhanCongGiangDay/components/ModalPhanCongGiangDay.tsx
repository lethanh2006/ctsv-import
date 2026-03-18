import { ETrangThaiDuyetGiangDay, colorTrangThaiDuyetGiangDay } from '@/services/DaoTaoV2/HocKy/constant';
import { CheckOutlined } from '@ant-design/icons';
import { Button, Card, Descriptions, Steps, Tag } from 'antd';
import { useEffect, useState } from 'react';
import { useIntl, useModel } from 'umi';
import NhanSuLopHocPhan from '../../NhanSuLopHocPhan';
import TableThoiKhoaBieu from '../../ThoiKhoaBieu/ThoiKhoaBieuView';

const ModalPhanCongGiangDay = (props: any) => {
	const intl = useIntl();
	const { record, duyetGiangDayLopHocPhanModel, setRecord } = useModel('daotaov2.hocky.lophocphan');
	const { total } = useModel('daotaov2.hocky.nhansulophocphan');
	const [currentStep, setCurrentStep] = useState(0);
	const { getData } = props;

	useEffect(() => {
		setCurrentStep(0);
	}, [record?._id]);

	useEffect(() => {
		if (getData && record?._id)
			getData().then((res: any) => Array.isArray(res) && setRecord(res.find((item) => item._id === record._id)));
	}, [total]);

	const onChangeStep = (step: number) => {
		setCurrentStep(step);
	};

	const handleDuyet = (): void => {
		if (record?._id && record.maHocKy)
			duyetGiangDayLopHocPhanModel(record.maHocKy, {
				trangThaiDuyetGiangDay: ETrangThaiDuyetGiangDay.DA_DUYET,
				lopHocPhanIds: [record._id],
			})
				.then(() => {
					if (getData) getData();
				})
				.catch((er) => console.log(er));
	};

	return (
		<Card title={intl.formatMessage({ id: 'kyhoc.phanconggiangday.title' })}>
			<Descriptions column={{ xs: 1, sm: 1, md: 2 }}>
				<Descriptions.Item label='Mã lớp tín chỉ'>{record?.ten}</Descriptions.Item>
				<Descriptions.Item label='Học phần'>{record?.hocPhan?.ten}</Descriptions.Item>
				<Descriptions.Item label='Mã học phần'>{record?.maHocPhan}</Descriptions.Item>
				<Descriptions.Item label='Trạng thái duyệt giảng dạy'>
					{record?.trangThaiDuyetGiangDay && (
						<Tag color={colorTrangThaiDuyetGiangDay?.[record?.trangThaiDuyetGiangDay]}>
							{record?.trangThaiDuyetGiangDay}
						</Tag>
					)}
				</Descriptions.Item>
			</Descriptions>
			<Button
				type='primary'
				className='btn-success'
				icon={<CheckOutlined />}
				onClick={handleDuyet}
				disabled={record?.trangThaiDuyetGiangDay === ETrangThaiDuyetGiangDay.DA_DUYET || !total}
			>
				Duyệt phân công
			</Button>

			<Steps
				current={currentStep}
				type='navigation'
				style={{ marginBottom: 18, marginTop: 12 }}
				onChange={record?._id ? onChangeStep : undefined}
			>
				<Steps.Step title='Giảng viên' disabled={!record?._id} />
				<Steps.Step title='Lịch học chi tiết' disabled={!record?._id} />
			</Steps>

			{currentStep === 0 ? <NhanSuLopHocPhan /> : currentStep === 1 ? <TableThoiKhoaBieu fromPhanCong /> : null}
		</Card>
	);
};

export default ModalPhanCongGiangDay;
