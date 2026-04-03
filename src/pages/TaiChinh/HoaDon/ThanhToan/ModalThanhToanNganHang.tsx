import { unitName } from '@/services/base/constant';
import { removeVietnameseTones } from '@/utils/utils';
import { Col, Modal, Row, Space } from 'antd';
import { useIntl, useModel } from 'umi';

const ModalThanhToanNganHang = (props: { visible: boolean; onOk: () => void }) => {
	const { visible, onOk } = props;
	const { record } = useModel('taichinh.giaodich');
	const { initialState } = useModel('@@initialState');
	const intl = useIntl();

	const userFullname =
		record?.userFullname ??
		(initialState?.currentUser?.family_name
			? `${initialState.currentUser.family_name} ${initialState.currentUser?.given_name ?? ''}`
			: initialState?.currentUser?.name);
	const userCode = record?.userCode ?? initialState?.currentUser?.preferred_username ?? '';
	const addInfo = removeVietnameseTones(
		`${userCode ?? ''} ${userFullname ?? ''} ${record?.name ?? intl.formatMessage({ id: 'taichinh.hoadon.thanhtoannganhang.defaultName' })}`,
	).toUpperCase();
	const unitInfo = removeVietnameseTones(unitName).toUpperCase();

	// useEffect(() => {
	// 	getLopHc();
	// }, []);

	const renderLopThuong = () => (
		<Row gutter={[12, 12]}>
			<Col span={24}>{intl.formatMessage({ id: 'taichinh.hoadon.thanhtoannganhang.lopThuong.info' })}</Col>
			<Col xs={24} md={14}>
				<b>
					<u>{intl.formatMessage({ id: 'taichinh.hoadon.thanhtoannganhang.instructions' })}</u>
				</b>
				<p>
					1. {intl.formatMessage({ id: 'taichinh.hoadon.thanhtoannganhang.qrScan' })}
					<br />
					{intl.formatMessage({ id: 'taichinh.hoadon.thanhtoannganhang.qrDescription' })}
				</p>
				<p>
					2. {intl.formatMessage({ id: 'taichinh.hoadon.thanhtoannganhang.bankApp' })}
					<br />
					{intl.formatMessage({ id: 'taichinh.hoadon.thanhtoannganhang.bankAppDescription' })}{' '}
					<a
						target='_blank'
						href='https://xettuyen.vinuni.edu.vn/api/file/64d502982f7f8d0cac246178/hd_thanhtoan.pdf'
						rel='noreferrer'
					>
						{intl.formatMessage({ id: 'taichinh.hoadon.thanhtoannganhang.hdLinkText' })}
					</a>
					<br />
					{intl.formatMessage({ id: 'taichinh.hoadon.thanhtoannganhang.paymentCode' })}: <b>{record?.identityCode}</b>
					<br />
					{intl.formatMessage({ id: 'taichinh.hoadon.thanhtoannganhang.accountNumber' })}:{' '}
					<b>v100098{record?.identityCode}</b>
				</p>
				<p>
					<b>
						{intl.formatMessage({ id: 'taichinh.hoadon.thanhtoannganhang.noteTitle' })}: <br />
						1. {intl.formatMessage({ id: 'taichinh.hoadon.thanhtoannganhang.note1' })} <br />
						2. {intl.formatMessage({ id: 'taichinh.hoadon.thanhtoannganhang.note2' })}
					</b>
				</p>
			</Col>
			<Col xs={24} md={10}>
				<Space direction='vertical' style={{ alignItems: 'center' }}>
					<b>
						<u>{intl.formatMessage({ id: 'taichinh.hoadon.thanhtoannganhang.qrTitle' })}</u>
					</b>
					<img
						style={{ maxWidth: '100%' }}
						src={`https://img.vietqr.io/image/970405-v100098${record?.identityCode}-compact2.png?amount=${record?.amount}&addInfo=${addInfo}&accountName=${unitInfo}`}
					/>
					<i>{intl.formatMessage({ id: 'taichinh.hoadon.thanhtoannganhang.qrNote' })}</i>
				</Space>
			</Col>
		</Row>
	);

	const renderPhanHieu = () => (
		<Row gutter={[12, 12]}>
			<Col span={24}>{intl.formatMessage({ id: 'taichinh.hoadon.thanhtoannganhang.phanHieu.info' })}</Col>
			<Col xs={24} md={14}>
				<b>
					<u>{intl.formatMessage({ id: 'taichinh.hoadon.thanhtoannganhang.instructions' })}</u>
				</b>
				<p>
					1. {intl.formatMessage({ id: 'taichinh.hoadon.thanhtoannganhang.bankTransfer' })}
					<br />- {intl.formatMessage({ id: 'taichinh.hoadon.thanhtoannganhang.bankTransfer.accountName' })}
					<br />- {intl.formatMessage({ id: 'taichinh.hoadon.thanhtoannganhang.bankTransfer.accountNumber' })}:{' '}
					<b>123000079922</b>
					<br />- {intl.formatMessage({ id: 'taichinh.hoadon.thanhtoannganhang.bankTransfer.content' })}
					<br />- {intl.formatMessage({ id: 'taichinh.hoadon.thanhtoannganhang.bankTransfer.example' })}:{' '}
					<i>23123456P NGUYEN VAN A HocphiHK2NH20232024</i>
				</p>
				<p>
					2. {intl.formatMessage({ id: 'taichinh.hoadon.thanhtoannganhang.qrScan' })}
					<br />
					{intl.formatMessage({ id: 'taichinh.hoadon.thanhtoannganhang.qrDescription' })}
				</p>
				<p>
					<b>
						{intl.formatMessage({ id: 'taichinh.hoadon.thanhtoannganhang.noteTitle' })}: <br />
						{intl.formatMessage({ id: 'taichinh.hoadon.thanhtoannganhang.note1' })}
					</b>
				</p>
			</Col>
			<Col xs={24} md={10}>
				<Space direction='vertical' style={{ alignItems: 'center' }}>
					<b>
						<u>{intl.formatMessage({ id: 'taichinh.hoadon.thanhtoannganhang.qrTitle' })}</u>
					</b>
					<img
						style={{ maxWidth: '100%' }}
						src={`https://img.vietqr.io/image/970415-123000079922-compact2.png?amount=${record?.amount}&addInfo=${addInfo}&accountName=${'PHAN HIEU HOC VIEN PHU NU VIET NAM'}`}
					/>
					<i>{intl.formatMessage({ id: 'taichinh.hoadon.thanhtoannganhang.qrNote' })}</i>
				</Space>
			</Col>
		</Row>
	);

	if (!record?._id) return <></>;
	return (
		<Modal
			open={visible}
			onCancel={() => onOk()}
			title={intl.formatMessage({ id: 'taichinh.hoadon.thanhtoannganhang.modalTitle' })}
			okButtonProps={{ hidden: true }}
			width={1000}
		>
			{renderLopThuong()}
			{/* {isPhanHieu ? renderPhanHieu() : renderLopThuong()} */}
		</Modal>
	);
};

export default ModalThanhToanNganHang;
