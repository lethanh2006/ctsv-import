import TableStaticData from '@/components/Table/TableStaticData';
import { type IColumn } from '@/components/Table/typing';
import FilterLopHanhChinh from '@/pages/DaoTaoV2/NamHoc/LopHanhChinh/components/FilterLopHanhChinh';
import { type LopHanhChinh } from '@/services/DaoTaoV2/NamHoc/LopHanhChinh/typings';
import { Card, Col, Empty, Row } from 'antd';
import { useEffect, useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import SplitPane from 'react-split-pane';
import Pane from 'react-split-pane/lib/Pane';
import { useModel } from 'umi';

const CardLopHanhChinh = (props: { children: JSX.Element; title?: string; otherComponent?: JSX.Element }) => {
	const { record: recLopHanhChinh } = useModel('daotaov2.namhoc.lophanhchinh');
	const { getAllModel, danhSach, setRecord, record } = useModel('daotaov2.namhoc.sinhvienlophanhchinh');
	const { children, title } = props;
	const isMobile = useMediaQuery({ query: '(max-width: 767px)' });
	const [paneSize, setPaneSize] = useState('30%');

	const handlePaneSizeChange = (size: any) => {
		setPaneSize(size[0]);
	};

	const onCell = (rec: LopHanhChinh.IRecordSinhVien) => ({
		onClick: () => setRecord(rec),
		style: {
			cursor: 'pointer',
			fontWeight: rec._id === record?._id ? 600 : undefined,
			backgroundColor: rec._id === record?._id ? 'var(--color-primary-bg)' : undefined,
		},
	});

	const getData = () => recLopHanhChinh?._id && getAllModel(true, undefined, { lopHanhChinhId: recLopHanhChinh._id });

	useEffect(() => {
		getData();
	}, [recLopHanhChinh?._id]);

	const columns: IColumn<LopHanhChinh.IRecordSinhVien>[] = [
		{
			title: 'TT',
			dataIndex: 'index',
			align: 'center',
			width: 40,
			onCell,
		},
		{
			title: 'Mã SV',
			dataIndex: ['sinhVien', 'ma'],
			width: 80,
			align: 'center',
			filterType: 'string',
			onCell,
		},
		{
			title: 'Họ tên',
			dataIndex: ['sinhVien', 'ten'],
			width: 150,
			filterType: 'string',
			onCell,
		},
	];

	return (
		<Card title={title}>
			<Row gutter={[12, 0]}>
				<Col span={24}>
					<FilterLopHanhChinh>{props.otherComponent}</FilterLopHanhChinh>
				</Col>

				{recLopHanhChinh?._id ? (
					<Col span={24}>
						<SplitPane split={isMobile ? 'horizontal' : 'vertical'} onChange={handlePaneSizeChange}>
							<Pane initialSize={paneSize} minSize='20%'>
								<Card
									title={`DS sinh viên lớp ${recLopHanhChinh?.ten ?? ''}`}
									bordered={false}
									headStyle={{ padding: 0 }}
									styles={{ padding: '8px 0 0' }}
								>
									<TableStaticData columns={columns} data={danhSach} otherProps={{ size: 'small' }} hasTotal />
								</Card>
							</Pane>

							<Pane minSize='40%'>
								{record?._id ? (
									<>
										<div className='ant-descriptions-title' style={{ fontSize: '16px', padding: '16px 0' }}>
											Kết quả học tập của sinh viên {record?.sinhVien?.ten}
										</div>

										{children}
									</>
								) : (
									<Empty description='Vui lòng chọn sinh viên !' style={{ marginTop: 32, marginBottom: 32 }} />
								)}
							</Pane>
						</SplitPane>
					</Col>
				) : (
					<Col span={24}>
						<Empty description='Vui lòng chọn lớp hành chính !' style={{ marginTop: 32, marginBottom: 32 }} />
					</Col>
				)}
			</Row>
		</Card>
	);
};

export default CardLopHanhChinh;
