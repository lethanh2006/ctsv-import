import UploadFile from '@/components/Upload/UploadFile';
import { buildUpLoadFile } from '@/services/uploadFile';
import { ipCsvc } from '@/utils/ip';
import { useModel } from '@umijs/max';
import { Form, message, Modal } from 'antd';
import React, { useEffect, useState } from 'react';

interface UploadMinhChungModalProps {
	open: boolean;
	onCancel: () => void;
	currentRecord: any;
	activeSemesterId?: string;
	onSuccess: () => void;
}

export const UploadMinhChungModal: React.FC<UploadMinhChungModalProps> = ({
	open,
	onCancel,
	currentRecord,
	activeSemesterId,
	onSuccess,
}) => {
	const { putDonMienKTX } = useModel('kytucxa.danhsachmienkytucxa');
	const [uploadForm] = Form.useForm();
	const [submitting, setSubmitting] = useState(false);

	useEffect(() => {
		if (open && currentRecord) {
			uploadForm.setFieldsValue({
				urlMinhChung: currentRecord.urlMinhChung || undefined,
			});
		} else {
			uploadForm.resetFields();
		}
	}, [open, currentRecord]);

	const handleUploadSubmit = async () => {
		if (!currentRecord?._id || !activeSemesterId) return;
		try {
			const values = await uploadForm.validateFields();
			setSubmitting(true);
			const fileUrl = await buildUpLoadFile(values, 'urlMinhChung', undefined, undefined, ipCsvc);
			if (!fileUrl) {
				message.error('Tải file lên thất bại');
				return;
			}

			const payload = {
				danhSachId: activeSemesterId,
				maSinhVien: currentRecord.code,
				ssoId: currentRecord.ssoId,
				hoTen: currentRecord.fullname,
				khoaSinhVien: currentRecord.khoaSinhVien,
				urlMinhChung: fileUrl,
				trangThaiMinhChung: 'Chờ duyệt',
			};

			await putDonMienKTX(currentRecord._id, payload);

			message.success('Cập nhật minh chứng thành công');
			onSuccess();
		} catch (err: any) {
			console.error(err);
			message.error(err?.response?.data?.message || 'Có lỗi xảy ra');
		} finally {
			setSubmitting(false);
		}
	};

	return (
		<Modal
			open={open}
			title={<span style={{ fontWeight: 700, fontSize: 16 }}>Cập nhật minh chứng miễn giảm KTX</span>}
			okText='Xác nhận'
			cancelText='Hủy'
			confirmLoading={submitting}
			onOk={handleUploadSubmit}
			onCancel={onCancel}
			okButtonProps={{
				style: {
					backgroundColor: '#125195',
					borderColor: '#125195',
					borderRadius: 6,
				},
			}}
			cancelButtonProps={{
				style: { borderRadius: 6 },
			}}
			destroyOnClose
		>
			<div style={{ marginTop: 16 }}>
				<div style={{ marginBottom: 12, fontSize: 14 }}>
					Sinh viên: <strong>{currentRecord?.fullname || ''}</strong> ({currentRecord?.code || ''})
				</div>
				<Form form={uploadForm} layout='vertical'>
					<Form.Item
						name='urlMinhChung'
						label={<strong>File minh chứng</strong>}
						rules={[{ required: true, message: 'Vui lòng tải lên file minh chứng!' }]}
					>
						<UploadFile maxCount={1} accept='.pdf,.png,.jpg,.jpeg,.doc,.docx' />
					</Form.Item>
				</Form>
			</div>
		</Modal>
	);
};
