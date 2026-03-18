import PrintTemplate from '@/components/PrintTemplate';
import ButtonExtend from '@/components/Table/ButtonExtend';
import { PrinterOutlined } from '@ant-design/icons';
import { Col, Modal, Row, Select, Space } from 'antd';
import _ from 'lodash';
import { useCallback, useRef, useState } from 'react';
import ReactToPrint from 'react-to-print';
import { useModel } from 'umi';
import TableKhoiHocPhanCTDT from './TableHocPhan';
import TitlePrintCTDT from './TitlePrintCTDT';

const PreviewDanhSachHocPhan = (props: { visble: boolean; setVisible: (vis: boolean) => void }) => {
	const { visble, setVisible } = props;
	const { danhSach } = useModel('daotaov2.chuongtrinhdaotao.khoihocphanctdt');
	const [selectChuyenNganh, setSelectChuyenNganh] = useState<{ ma?: string; ten?: string }>();
	const componentRef = useRef(null);
	const listChuyenNganh = _.uniqBy(
		danhSach.filter((item) => item.maChuyenNganh),
		(item) => item.maChuyenNganh,
	);

	const reactToPrintContent = useCallback(() => componentRef.current, [componentRef.current]);

	const reactToPrintTrigger = useCallback(
		() => <ButtonExtend icon={<PrinterOutlined />}>In danh sách</ButtonExtend>,
		[],
	);

	return (
		<Modal
			title='Danh sách học phần thuộc CTĐT'
			open={visble}
			onCancel={() => setVisible(false)}
			okButtonProps={{ hidden: true }}
			cancelText='Đóng'
			width={1000}
		>
			<Row gutter={[12, 12]}>
				<Col span={24}>
					<Space>
						<Select
							style={{ width: '250px' }}
							placeholder='Xem theo chuyên ngành'
							options={listChuyenNganh.map((item) => ({
								key: item.maChuyenNganh,
								value: item.maChuyenNganh,
								label: item.chuyenNganh?.ten,
								ma: item.maChuyenNganh,
								ten: item.chuyenNganh?.ten,
							}))}
							value={selectChuyenNganh?.ma}
							onChange={(val, opt) => setSelectChuyenNganh(opt as any)}
							allowClear
						/>

						<ReactToPrint
							content={reactToPrintContent}
							documentTitle='Danh sách học phần chi tiết'
							trigger={reactToPrintTrigger}
							removeAfterPrint
						/>
					</Space>
				</Col>

				<Col span={24}>
					<PrintTemplate ref={componentRef}>
						<TitlePrintCTDT tenChuyenNganh={selectChuyenNganh?.ten} />
						<div className='to-print'>
							<TableKhoiHocPhanCTDT chuyenNganh={selectChuyenNganh?.ma} toPrint />
						</div>
					</PrintTemplate>
					<TableKhoiHocPhanCTDT chuyenNganh={selectChuyenNganh?.ma} />
				</Col>
			</Row>
		</Modal>
	);
};

export default PreviewDanhSachHocPhan;
