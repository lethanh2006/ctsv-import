import { ETrangThaiLopHocPhan } from '@/services/DaoTaoV2/HocKy/constant';
import { Descriptions, Tag } from 'antd';
import { useIntl, useModel } from 'umi';
import RenderLichHoc from './RenderLichHoc';

const ViewChiTietLopHp = () => {
	const intl = useIntl();
	const { record } = useModel('daotaov2.hocky.lophocphan');

	return (
		<Descriptions
			column={{ xxl: 2, xl: 2, lg: 2, md: 2, sm: 1, xs: 1 }}
			title={intl.formatMessage({ id: 'loptinchi.lichhoc.chitietlop.title' })}
		>
			<Descriptions.Item label={intl.formatMessage({ id: 'loptinchi.lichhoc.chitiet.tenloptinchi' })}>
				{record?.ten ?? ''} {record?.lopNhuCau ? intl.formatMessage({ id: 'loptinchi.lichhoc.chitiet.lopnhucau' }) : ''}
			</Descriptions.Item>
			<Descriptions.Item label={intl.formatMessage({ id: 'loptinchi.lichhoc.chitiet.hocky' })}>
				{record?.hocKy?.ten ?? ''}
			</Descriptions.Item>
			<Descriptions.Item label={intl.formatMessage({ id: 'loptinchi.lichhoc.chitiet.hocphan' })}>
				{record?.hocPhan?.ten ?? ''}
			</Descriptions.Item>
			<Descriptions.Item label={intl.formatMessage({ id: 'loptinchi.lichhoc.chitiet.masohocphan' })}>
				{record?.hocPhan?.ma ?? ''}
			</Descriptions.Item>
			<Descriptions.Item label={intl.formatMessage({ id: 'loptinchi.lichhoc.chitiet.sisotoida' })}>
				{record?.siSoToiDa ?? ''}
			</Descriptions.Item>
			<Descriptions.Item label={intl.formatMessage({ id: 'loptinchi.lichhoc.chitiet.trangthailop' })}>
				{
					<Tag color={record?.trangThaiLop === ETrangThaiLopHocPhan.DONG ? 'red' : 'green'}>
						{record?.trangThaiLop === ETrangThaiLopHocPhan.DONG
							? intl.formatMessage({ id: 'loptinchi.lichhoc.chitiet.dahuy' })
							: record?.trangThaiLop}
					</Tag>
				}
			</Descriptions.Item>

			<Descriptions.Item label={intl.formatMessage({ id: 'loptinchi.lichhoc.chitiet.giangvien' })}>
				{record?.nhanSuList
					?.map((item) => (item.nhanSu?.ten ? `${item.nhanSu?.hoDem ?? ''} ${item.nhanSu?.ten ?? ''}` : item.tenNhanSu))
					?.join(', ')}
			</Descriptions.Item>
			{record?._id ? (
				<Descriptions.Item label={intl.formatMessage({ id: 'loptinchi.lichhoc.chitiet.lichhoc' })} span={2}>
					{record.tenLopGhepTkb ? (
						<div style={{ marginBottom: 8 }}>
							{intl.formatMessage(
								{ id: 'loptinchi.lichhoc.chitiet.tenlopgheplich' },
								{ tenlopghep: record.tenLopGhepTkb },
							)}
						</div>
					) : null}
					<div>
						<RenderLichHoc lopHocPhan={record} showAll />
					</div>
				</Descriptions.Item>
			) : null}

			<Descriptions.Item label={intl.formatMessage({ id: 'loptinchi.lichhoc.chitiet.khoanganhdukien' })} span={2}>
				{record?.listLopHpKn?.map((i) => i.khoaNganh?.ten ?? i.maKn).join(', ')}
			</Descriptions.Item>
		</Descriptions>
	);
};

export default ViewChiTietLopHp;
