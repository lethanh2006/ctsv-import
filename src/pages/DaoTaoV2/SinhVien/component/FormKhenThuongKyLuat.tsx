import QuyetDinh from '@/pages/CheDoChinhSach/QuyetDinh';
import { ELoaiCheDoSinhVien } from '@/services/CheDoSinhVien/constant';
import { Collapse } from 'antd';
import { useIntl, useModel } from 'umi';

const FormKhenThuongKyLuat = () => {
	const intl = useIntl();
	const { record } = useModel('daotaov2.sinhvien.sinhvien');

	return (
		<>
			<Collapse destroyInactivePanel accordion>
				<Collapse.Panel header={intl.formatMessage({ id: 'kyluatkhenthuong.thongtinkhenthuong.panel' })} key={'1'}>
					{/* <KhenThuongSinhVienPage/> */}
					<QuyetDinh
						filterWidth={600}
						ssoId={record?.ssoId}
						loaiCheDoSinhVien={ELoaiCheDoSinhVien.KHEN_THUONG}
						title={intl.formatMessage({ id: 'kyluatkhenthuong.khenthuong.title' })}
					/>
				</Collapse.Panel>

				<Collapse.Panel header={intl.formatMessage({ id: 'kyluatkhenthuong.thongtinkyluat.panel' })} key={'2'}>
					{/* <KyLuatSinhVienPage /> */}
					<QuyetDinh
						filterWidth={200}
						ssoId={record?.ssoId}
						loaiCheDoSinhVien={ELoaiCheDoSinhVien.KY_LUAT}
						title={intl.formatMessage({ id: 'kyluatkhenthuong.kyluat.title' })}
					/>
				</Collapse.Panel>
			</Collapse>
		</>
	);
};

export default FormKhenThuongKyLuat;
