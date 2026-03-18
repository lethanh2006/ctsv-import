import { Modal } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';
import ModalSinhVien from './ModalSinhVien';
import PreviewHoSo from './PreviewHoSo';

const ModalChiTietSinhVien = (props: { sinhVienSsoId: string; hasEdit?: boolean; hasDetail?: boolean }) => {
	const { getByIdModel, visibleForm, setVisibleForm, isView } = useModel('daotaov2.sinhvien.sinhvien');

	useEffect(() => {
		if (props.sinhVienSsoId && visibleForm) getByIdModel(`${props.sinhVienSsoId}/info`);
	}, [props.sinhVienSsoId, visibleForm]);

	return (
		<Modal
			open={visibleForm}
			footer={null}
			width={1100}
			onCancel={() => setVisibleForm(false)}
			maskClosable={false}
			styles={{ body: { padding: 0 } }}
		>
			{!isView && (props.hasEdit || props.hasDetail) ? (
				<ModalSinhVien disabledForm={!props.hasEdit && props.hasDetail} />
			) : (
				<PreviewHoSo hasEdit={props.hasEdit || props.hasDetail} />
			)}
		</Modal>
	);
};

export default ModalChiTietSinhVien;
