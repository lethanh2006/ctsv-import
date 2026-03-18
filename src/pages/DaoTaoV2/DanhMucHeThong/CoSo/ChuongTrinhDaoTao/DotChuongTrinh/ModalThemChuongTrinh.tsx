import { Button, Card, Descriptions, message } from 'antd';
import dayjs from 'dayjs';
import { useEffect } from 'react';
import { useIntl, useModel } from 'umi';
import TableChonChuongTrinh from './TableChonChuongTrinh';

const ModalThemChuongTrinh = (props: { getData?: () => void; [key: string]: any }) => {
	const intl = useIntl();
	const { record: recDot } = useModel('daotaov2.chuongtrinhdaotao.dotrasoat');
	const { formSubmiting, setVisibleForm, postDotChuongTrinhModel, visibleForm } = useModel(
		'chuongtrinhdaotao.dotchuongtrinh',
	);
	const { selectedIds, total, setSelectedIds } = useModel('daotaov2.chuongtrinhdaotao.chuongtrinh');
	const { getData } = props;

	useEffect(() => {
		if (!visibleForm) setSelectedIds([]);
	}, [visibleForm]);

	const onFinish = () => {
		if (!selectedIds?.length) {
			message.error('Chưa chọn chương trình đào tạo');
			return;
		}
		if (recDot?._id)
			postDotChuongTrinhModel(recDot._id, selectedIds)
				.then(() => {
					if (getData) getData();
					setSelectedIds([]);
				})
				.catch((er) => console.log(er));
	};

	return (
		<Card title='Thêm chương trình đào tạo để rà soát'>
			<Descriptions column={{ xs: 1, sm: 1, md: 2 }}>
				<Descriptions.Item label='Tên đợt rà soát'>{recDot?.ten}</Descriptions.Item>
				<Descriptions.Item label='Năm học'>{recDot?.namHoc?.ten ?? recDot?.maNamHoc ?? ''}</Descriptions.Item>
				<Descriptions.Item label='Thời gian bắt đầu'>
					{recDot?.thoiGianBatDau ? dayjs(recDot.thoiGianBatDau).format('DD/MM/YYYY') : ''}
				</Descriptions.Item>
				<Descriptions.Item label='Thời gian kết thúc'>
					{recDot?.thoiGianKetThuc ? dayjs(recDot.thoiGianKetThuc).format('DD/MM/YYYY') : ''}
				</Descriptions.Item>
			</Descriptions>

			<div className='fw500'>Danh sách chương trình có thể thêm vào đợt rà soát</div>
			<TableChonChuongTrinh />

			<div className='form-footer'>
				{total ? (
					<Button
						loading={formSubmiting}
						htmlType='submit'
						type='primary'
						disabled={!selectedIds?.length}
						onClick={onFinish}
					>
						Thêm vào đợt
					</Button>
				) : null}
				<Button onClick={() => setVisibleForm(false)}>{intl.formatMessage({ id: 'global.button.huy' })}</Button>
			</div>
		</Card>
	);
};

export default ModalThemChuongTrinh;
