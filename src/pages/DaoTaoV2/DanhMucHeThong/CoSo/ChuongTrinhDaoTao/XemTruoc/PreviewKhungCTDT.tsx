import PrintTemplate from '@/components/PrintTemplate';
import ButtonExtend from '@/components/Table/ButtonExtend';
import { PrinterOutlined } from '@ant-design/icons';
import { Col, Modal, Row, Select, Space } from 'antd';
import _ from 'lodash';
import { useRef, useState } from 'react';
import { useReactToPrint } from 'react-to-print';
import { useModel } from 'umi';
import TableKhoiHocPhanCTDT from './TableHocPhan';
import TitlePrintCTDT from './TitlePrintCTDT';

const PreviewKhungCTDT = (props: { visble: boolean; setVisible: (vis: boolean) => void }) => {
	const { visble, setVisible } = props;
	const { danhSach } = useModel('daotaov2.chuongtrinhdaotao.khoihocphanctdt');
	const [selectChuyenNganh, setSelectChuyenNganh] = useState<{ ma?: string; ten?: string }>();
	const componentRef = useRef(null);
	const listHocKy = _.uniq(
		danhSach
			.filter((item) => !selectChuyenNganh || !item.maChuyenNganh || selectChuyenNganh === item.maChuyenNganh)
			.map((item) => item.soThuTuKy),
	);
	const emptyHocKy = danhSach
		.filter((item) => !selectChuyenNganh || !item.maChuyenNganh || selectChuyenNganh === item.maChuyenNganh)
		.find((item) => !item.soThuTuKy);
	const listChuyenNganh = _.uniqBy(
		danhSach.filter((item) => item.maChuyenNganh),
		(item) => item.maChuyenNganh,
	);

	const handlePrint = useReactToPrint({ contentRef: componentRef });

	return (
		<Modal
			title='Khung chương trình đào tạo'
			open={visble}
			onCancel={() => setVisible(false)}
			okButtonProps={{ hidden: true }}
			cancelText='Đóng'
			width={1000}
		>
			<Space wrap style={{ marginBottom: 12 }}>
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

				<ButtonExtend icon={<PrinterOutlined />} onClick={() => handlePrint()}>
					In khung chương trình
				</ButtonExtend>
			</Space>

			<Row gutter={[12, 12]}>
				{listHocKy.map((hk) => (
					<Col span={24} key={hk}>
						<div className='fw500' style={{ fontSize: 16 }}>
							Học kỳ {hk}
						</div>
						<TableKhoiHocPhanCTDT hocKy={hk} chuyenNganh={selectChuyenNganh?.ma} />
					</Col>
				))}

				{emptyHocKy ? (
					<Col span={24} key={-1}>
						<div className='fw500' style={{ fontSize: 16 }}>
							Khối tự chọn khác
						</div>
						<TableKhoiHocPhanCTDT hocKy={-1} chuyenNganh={selectChuyenNganh?.ma} />
					</Col>
				) : null}
			</Row>

			<PrintTemplate ref={componentRef}>
				<TitlePrintCTDT tenChuyenNganh={selectChuyenNganh?.ten} />
				<div className='to-print'>
					<Row gutter={[12, 12]}>
						{listHocKy.map((hk) => (
							<Col span={24} key={hk}>
								<div className='fw500'>Học kỳ {hk}</div>
								<TableKhoiHocPhanCTDT hocKy={hk} chuyenNganh={selectChuyenNganh?.ma} toPrint />
							</Col>
						))}

						{emptyHocKy ? (
							<Col span={24} key={-1}>
								<div className='fw500'>Khối tự chọn khác</div>
								<TableKhoiHocPhanCTDT hocKy={-1} chuyenNganh={selectChuyenNganh?.ma} toPrint />
							</Col>
						) : null}
					</Row>
				</div>
			</PrintTemplate>
		</Modal>
	);
};

export default PreviewKhungCTDT;
