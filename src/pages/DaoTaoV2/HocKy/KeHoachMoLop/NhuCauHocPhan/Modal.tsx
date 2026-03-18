import type { HocPhan } from '@/services/DaoTaoV2/DanhMucHeThong/HocPhan/typings';
import { loaiNhuCauHocPhan, type ELoaiNhuCauHocPhan } from '@/services/DaoTaoV2/HocKy/constant';
import { Descriptions, Modal } from 'antd';
import { useModel } from 'umi';
import NhuCauHocPhanPage from '.';

const ModalChiTietNhuCauHocPhan = (props: { maHocPhan: string; deCuongHphk?: HocPhan.IDeCuongHocPhanHocKy }) => {
	const { visibleForm, setVisibleForm } = useModel('daotaov2.hocky.nhucauhocphan');
	const { maHocPhan, deCuongHphk } = props;

	return (
		<Modal
			open={visibleForm}
			onCancel={() => setVisibleForm(false)}
			footer={null}
			width={1000}
			title='Nhu cầu học phần'
		>
			{deCuongHphk?._id ? (
				<Descriptions column={{ xs: 1, sm: 1, md: 2 }} title='Tổng số các loại nhu cầu'>
					{Object.entries(loaiNhuCauHocPhan).map(([field, title]) => (
						<Descriptions.Item key={field} label={title}>
							{deCuongHphk?.[field as ELoaiNhuCauHocPhan]}
						</Descriptions.Item>
					))}
				</Descriptions>
			) : null}

			<NhuCauHocPhanPage maHocPhan={maHocPhan} />
		</Modal>
	);
};

export default ModalChiTietNhuCauHocPhan;
