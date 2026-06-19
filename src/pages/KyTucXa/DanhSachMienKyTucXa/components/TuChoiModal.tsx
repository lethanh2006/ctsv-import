import React, { useEffect, useState } from 'react';
import { Modal, Input, message } from 'antd';
import { useModel } from '@umijs/max';

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
            message.success('Từ chối thành công');
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
            title={
                <span style={{ fontWeight: 700, fontSize: 16 }}>
                    Từ chối miễn giảm KTX
                </span>
            }
            okText="Xác nhận"
            cancelText="Hủy"
            confirmLoading={submitting}
            onOk={handleActionSubmit}
            onCancel={onCancel}
            okButtonProps={{
                style: {
                    backgroundColor: '#ff4d4f',
                    borderColor: '#ff4d4f',
                    borderRadius: 6
                }
            }}
            cancelButtonProps={{
                style: { borderRadius: 6 }
            }}
        >
            <div style={{ marginTop: 16 }}>
                <div style={{ marginBottom: 12, fontSize: 14 }}>
                    Sinh viên: <strong>{currentRecord?.fullname || ''}</strong> ({currentRecord?.code || ''})
                </div>
                <div style={{ marginBottom: 8, fontWeight: 'bold' }}>Lý do từ chối:</div>
                <Input.TextArea
                    rows={4}
                    value={ghiChuDuyet}
                    onChange={(e) => setGhiChuDuyet(e.target.value)}
                    placeholder="Nhập lý do từ chối..."
                    style={{ borderRadius: 6 }}
                />
            </div>
        </Modal>
    );
};
