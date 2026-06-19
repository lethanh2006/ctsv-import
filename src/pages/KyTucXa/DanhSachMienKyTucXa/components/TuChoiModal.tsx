import { useIntl, useModel } from '@umijs/max';
import { Input, message, Modal } from 'antd';
import React, { useEffect, useState } from 'react';

interface TuChoiModalProps {
	open: boolean;
	onCancel: () => void;
	currentRecord: any;
	activeSemesterId?: string;
	onSuccess: () => void;
}

export const TuChoiModal: React.FC<TuChoiModalProps> = ({
	open,
	onCancel,
	currentRecord,
	activeSemesterId,
	onSuccess,
}) => {
	const intl = useIntl();
	const t = (id: string) => intl.formatMessage({ id });
	const { postTuChoi } = useModel('kytucxa.danhsachmienkytucxa');
	const [ghiChuDuyet, setGhiChuDuyet] = useState('');
	const [submitting, setSubmitting] = useState(false);

	useEffect(() => {
		if (open && currentRecord) {
			setGhiChuDuyet(currentRecord.ghiChuDuyet || '');
		} else {
			setGhiChuDuyet('');
		}
	}, [open, currentRecord]);

	const handleActionSubmit = async () => {
		if (!currentRecord?._id || !activeSemesterId) return;
		setSubmitting(true);
		try {
			await postTuChoi(currentRecord._id, { ghiChuDuyet });
			message.success(t('kytucxa.danhsachmien.message.rejectSuccess'));
			onSuccess();
		} catch (err: any) {
			console.error(err);
			message.error(err?.response?.data?.message || t('kytucxa.danhsachmien.message.error'));
		} finally {
			setSubmitting(false);
		}
	};

	return (
		<Modal
			open={open}
			title={<span style={{ fontWeight: 700, fontSize: 16 }}>{t('kytucxa.danhsachmien.rejectTitle')}</span>}
			okText={t('global.button.xacnhan')}
			cancelText={t('global.button.huy')}
			confirmLoading={submitting}
			onOk={handleActionSubmit}
			onCancel={onCancel}
			okButtonProps={{
				style: {
					backgroundColor: '#ff4d4f',
					borderColor: '#ff4d4f',
					borderRadius: 6,
				},
			}}
			cancelButtonProps={{
				style: { borderRadius: 6 },
			}}
		>
			<div style={{ marginTop: 16 }}>
				<div style={{ marginBottom: 12, fontSize: 14 }}>
					{t('kytucxa.danhsachmien.sinhVien')}: <strong>{currentRecord?.fullname || ''}</strong> (
					{currentRecord?.code || ''})
				</div>
				<div style={{ marginBottom: 8, fontWeight: 'bold' }}>{t('kytucxa.danhsachmien.lyDoTuChoi')}:</div>
				<Input.TextArea
					rows={4}
					value={ghiChuDuyet}
					onChange={(e) => setGhiChuDuyet(e.target.value)}
					placeholder={t('kytucxa.danhsachmien.nhapLyDoTuChoi')}
					style={{ borderRadius: 6 }}
				/>
			</div>
		</Modal>
	);
};
