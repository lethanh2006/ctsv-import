import { ExclamationCircleFilled } from '@ant-design/icons';
import { Button, Modal } from 'antd';
import { useModel } from 'umi';

const ConfirmKetThucDotCanhBao = (props: {
	onOk?: () => void;
	isThoiHoc?: boolean;
	visibleForm?: boolean;
	setVisibleForm: (val: boolean) => void;
}) => {
	const { isThoiHoc, visibleForm, setVisibleForm } = props;
	const { chotDanhSachCanhBaoSinhVienModel, formSubmiting } = useModel(
		isThoiHoc ? 'daotaov2.ketquahoctap.xethocvu.thoihoc' : 'daotaov2.ketquahoctap.xethocvu.canhbao',
	);
	const { record: recHocKy } = useModel('daotaov2.hocky.hocky');

	const { onOk } = props;

	const onFinish = async () => {
		chotDanhSachCanhBaoSinhVienModel(recHocKy?.ma ?? '')
			.then(() => {
				setVisibleForm(false);
				if (onOk) onOk();
			})
			.catch((er) => console.log(er));
	};

	return (
		<Modal
			open={visibleForm}
			onCancel={() => setVisibleForm(false)}
			title='Kết thúc đợt xét cảnh báo'
			footer={null}
			maskClosable={false}
			width={800}
		>
			<div
				style={{
					display: 'flex',
					flexDirection: 'column',
					gap: 8,
					alignItems: 'center',
					marginBottom: 24,
				}}
			>
				<div style={{ color: 'orange', fontSize: 48 }}>
					<ExclamationCircleFilled />
				</div>
				<div>
					Xác nhận chốt danh sách {isThoiHoc ? 'cho thôi học' : 'cảnh báo học tập'} sinh viên <b>{recHocKy?.ten}</b>?
				</div>
				<div>Trước khi kết thúc đợt, hãy kiểm tra lại danh sách sinh viên</div>
			</div>

			<div className='form-footer'>
				<Button type='primary' loading={formSubmiting} onClick={onFinish}>
					Xác nhận
				</Button>
				<Button onClick={() => setVisibleForm(false)}>Hủy</Button>
			</div>
		</Modal>
	);
};

export default ConfirmKetThucDotCanhBao;
