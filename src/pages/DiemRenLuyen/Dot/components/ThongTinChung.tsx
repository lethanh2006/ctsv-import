import { Descriptions } from 'antd';
import dayjs from 'dayjs';
import { useIntl, useModel } from 'umi';

const ThongTinChung = () => {
	const intl = useIntl();
	const { record } = useModel('diemrenluyen.dot');

	return (
		<>
			<Descriptions column={2}>
				<Descriptions.Item label={intl.formatMessage({ id: 'diemrenluyen.dot.chitiet.thongtinchung.tendot' })}>
					{record?.tenDot}
				</Descriptions.Item>
				<Descriptions.Item label={intl.formatMessage({ id: 'diemrenluyen.dot.chitiet.thongtinchung.kyhoc' })}>
					{record?.kyHoc}
				</Descriptions.Item>
				<Descriptions.Item
					label={intl.formatMessage({ id: 'diemrenluyen.dot.chitiet.thongtinchung.tgtiepnhan' })}
					span={24}
				>
					{record?.thoiGianTiepNhanMinhChung
						? `${dayjs(record?.thoiGianTiepNhanMinhChung?.thoiGianBatDau).format('HH:mm DD/MM/YYYY')} - ${dayjs(
								record?.thoiGianTiepNhanMinhChung?.thoiGianKetThuc,
							).format('HH:mm DD/MM/YYYY')} `
						: '--'}
				</Descriptions.Item>
				<Descriptions.Item
					label={intl.formatMessage({ id: 'diemrenluyen.dot.chitiet.thongtinchung.tgsvcham' })}
					span={24}
				>
					{record?.thoiGianSVChamDiem
						? `${dayjs(record?.thoiGianSVChamDiem?.thoiGianBatDau).format('HH:mm DD/MM/YYYY')} - ${dayjs(
								record?.thoiGianSVChamDiem?.thoiGianKetThuc,
							).format('HH:mm DD/MM/YYYY')} `
						: '--'}
				</Descriptions.Item>
				<Descriptions.Item
					label={intl.formatMessage({ id: 'diemrenluyen.dot.chitiet.thongtinchung.tgbcscham' })}
					span={24}
				>
					{record?.thoiGianBCSChamDiem
						? `${dayjs(record?.thoiGianBCSChamDiem?.thoiGianBatDau).format('HH:mm DD/MM/YYYY')} - ${dayjs(
								record?.thoiGianBCSChamDiem?.thoiGianKetThuc,
							).format('HH:mm DD/MM/YYYY')} `
						: '--'}
				</Descriptions.Item>
				<Descriptions.Item
					label={intl.formatMessage({ id: 'diemrenluyen.dot.chitiet.thongtinchung.tgcvhtcham' })}
					span={24}
				>
					{record?.thoiGianCoVanChamDiem
						? `${dayjs(record?.thoiGianCoVanChamDiem?.thoiGianBatDau).format('HH:mm DD/MM/YYYY')} - ${dayjs(
								record?.thoiGianCoVanChamDiem?.thoiGianKetThuc,
							).format('HH:mm DD/MM/YYYY')} `
						: '--'}
				</Descriptions.Item>

				<Descriptions.Item
					label={intl.formatMessage({ id: 'diemrenluyen.dot.chitiet.thongtinchung.tgctsvcham' })}
					span={24}
				>
					{record?.thoiGianPhongCTSVChamDiem
						? `${dayjs(record?.thoiGianPhongCTSVChamDiem?.thoiGianBatDau).format('HH:mm DD/MM/YYYY')} - ${dayjs(
								record?.thoiGianPhongCTSVChamDiem?.thoiGianKetThuc,
							).format('HH:mm DD/MM/YYYY')} `
						: '--'}
				</Descriptions.Item>
			</Descriptions>
		</>
	);
};
export default ThongTinChung;
