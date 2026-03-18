import type { BieuMau } from '@/services/TienIch/BieuMau/typings';

const FileChoice = (props: { question: BieuMau.CauHoi; indexKhoi: number; indexCauHoi: number; traLoi?: any }) => {
	return (
		<>
			{props?.traLoi?.listUrlFile
				? props?.traLoi?.listUrlFile?.map((val: string | undefined, index: number) => {
						return (
							// eslint-disable-next-line react/jsx-key
							<a href={val} target={'_blank'} rel='noreferrer'>
								File {index + 1}
							</a>
						);
				  })
				: ''}
		</>
	);
};

export default FileChoice;
