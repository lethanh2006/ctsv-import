import { useModel } from 'umi';

const TitlePrintCTDT = (props: { tenChuyenNganh?: string }) => {
	const { record } = useModel('daotaov2.chuongtrinhdaotao.chuongtrinh');
	const { tenChuyenNganh } = props;

	return (
		<div className='to-print'>
			<div className='title'>CHƯƠNG TRÌNH ĐÀO TẠO</div>
			<div className='sub-title'>
				Trình độ: <b>{record?.trinhDoDaoTao?.ten}</b>
				<br />
				Ngành: <b>{record?.nganh?.ten}</b>
				{tenChuyenNganh ? (
					<>
						<br />
						Chuyên ngành: <b>{tenChuyenNganh}</b>
					</>
				) : null}
				<br />
				Tên chương trình: <b>{record?.ten}</b>
			</div>
		</div>
	);
};

export default TitlePrintCTDT;
