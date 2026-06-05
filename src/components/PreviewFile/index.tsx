import { EDinhDangFile } from '@/services/base/constant';
import type { IFileInfo } from '@/services/base/typing';
import { getFileContent, getFileInfo, getFileUrl } from '@/services/uploadFile';
import axios from '@/utils/axios';
import { ip3, ipFile } from '@/utils/ip';
import { getFileIdFromValue, getFileType, getNameFile } from '@/utils/utils';
import { DownloadOutlined, FileSearchOutlined, LeftOutlined, RightOutlined } from '@ant-design/icons';
import { Button, Empty, Spin } from 'antd';
import fileDownload from 'js-file-download';
import { useEffect, useState } from 'react';
import { useIntl } from 'umi';
import AuthImage from '../Image/AuthImage';
import PDFViewerV2 from '../PDFViewerV2';
import type { TPreviewFileProps } from '../PreviewFile/typing';
import ButtonExtend from '../Table/ButtonExtend';
import DocxViewer from './DocxViewer';
import './style.less';

type TFrameProps = {
	url: string;
	type: EDinhDangFile;
	name?: string;
	src?: string;
	data?: ArrayBuffer;
};

const PreviewFile: React.FC<TPreviewFileProps> = (props) => {
	const intl = useIntl();
	const { file, style = {}, children, ip = ip3, isFileId, tenFile, isPrivate } = props;

	const isValidStringArray = (value: any): value is string[] => {
		return Array.isArray(value) && value.every((item) => typeof item === 'string');
	};

	const isValidSingleString = typeof file === 'string';

	if (file && !isValidSingleString && !isValidStringArray(file)) {
		return (
			<div className='preview-error'>
				<p style={{ color: 'red', fontWeight: 600 }}>Invalid file</p>
			</div>
		);
	}

	const [frameData, setFrameData] = useState<TFrameProps>();
	const [loading, setLoading] = useState(false);
	const [currentFileIndex, setCurrentFileIndex] = useState(0);
	const [fileList, setFileList] = useState<string[]>([]);
	const [fileNameList, setFileNameList] = useState<string[]>([]);

	useEffect(() => {
		if (Array.isArray(file)) {
			setFileList(file);
			setCurrentFileIndex(0);
		} else if (typeof file === 'string') {
			setFileList([file]);
			setCurrentFileIndex(0);
		} else {
			setFileList([]);
		}

		if (tenFile) {
			if (Array.isArray(tenFile)) {
				setFileNameList(tenFile);
			} else {
				setFileNameList([tenFile]);
			}
		} else {
			setFileNameList([]);
		}
	}, [file, tenFile]);

	const getFileExtension = (url: string) => {
		const arr = url.split('?')[0].split('#')[0].split('.');
		return arr.length > 1 ? arr.at(-1)!.toLowerCase() : '';
	};

	const canPreviewDocx = (frame?: TFrameProps) =>
		frame?.type === EDinhDangFile.WORD &&
		!!frame.data &&
		(frame.name?.toLowerCase().endsWith('.docx') || getFileExtension(frame.url) === 'docx');

	const resolveFileType = (...values: Array<string | undefined>) => {
		for (const value of values) {
			const type = getFileType(value || '');
			if (type !== EDinhDangFile.UNKNOWN) return type;
		}
		return EDinhDangFile.UNKNOWN;
	};

	const getIframeSrc = (type: EDinhDangFile, fileUrl?: string) => {
		if (!fileUrl) return '';
		const officeFileType = [EDinhDangFile.WORD, EDinhDangFile.EXCEL, EDinhDangFile.POWERPOINT];
		if (type && officeFileType.includes(type)) {
			return `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(fileUrl)}`;
		} else {
			return fileUrl;
		}
	};

	const getFileDataFromUrl = async (srcUrl: string) => {
		const idFile = isFileId ? srcUrl : getFileIdFromValue(srcUrl);
		const fileServiceIp = srcUrl.includes('/file/') ? `${srcUrl.split('/file/')[0]}/file` : ip;
		const frame: TFrameProps = {
			url: srcUrl,
			type: EDinhDangFile.UNKNOWN,
		};

		try {
			// Nếu có thông tin id file thì get thông tin chi tiết
			if (idFile) {
				setLoading(true);
				const [fileInfoResult, fileUrlResult] = await Promise.all([
					getFileInfo(idFile, fileServiceIp),
					getFileUrl(idFile, fileServiceIp).catch((error) => {
						console.error(error);
						return undefined;
					}),
				]);
				const fileInfo: IFileInfo = fileInfoResult?.data?.data;
				const fileBaseUrl =
					fileServiceIp === ipFile || fileServiceIp.endsWith('/file') ? fileServiceIp : `${fileServiceIp}/file`;
				const proxiedFileUrl = `${fileBaseUrl}/${idFile}/${encodeURIComponent(fileInfo?.name ?? 'file')}?proxy=1`;
				frame.url = isPrivate
					? proxiedFileUrl
					: (fileUrlResult?.data?.data?.url ??
						fileInfo?.url ??
						`${fileBaseUrl}/${idFile}/${encodeURIComponent(fileInfo?.name ?? 'file')}`);
				frame.name = fileInfo?.name;

				// Mapping mimetype/name/url sang EDinhDangFile. Some records miss mimetype, so keep fallbacks.
				frame.type = resolveFileType(
					fileInfo?.mimetype,
					fileInfo?.name,
					getFileExtension(fileInfo?.name || ''),
					getFileExtension(frame.url),
					srcUrl,
				);
			} else {
				frame.type = resolveFileType(srcUrl, getFileExtension(srcUrl));
			}

			if (isPrivate) {
				// Nếu là file riêng tư thì phải lấy src có token mới xem được
				frame.data = (await getFileContent(frame.url))?.data;
			}

			// Fill other props
			if (frame.url && !frame.name) frame.name = getNameFile(frame.url);
			frame.src = getIframeSrc(frame.type, frame.url);
		} catch (error) {
			console.error(error);
		} finally {
			setLoading(false);
		}
		return frame;
	};

	useEffect(() => {
		const fetchFileType = async () => {
			if (fileList.length > 0) {
				const res = await getFileDataFromUrl(fileList[currentFileIndex]);
				setFrameData(res);
			}
		};

		fetchFileType();
	}, [fileList, currentFileIndex]);

	const handleDownloadOrView = async () => {
		if (!frameData?.url) return;

		// if (isDownloadableUrl(frameData.url)) {
		try {
			const response = await axios.get(frameData.url, {
				responseType: 'blob',
			});

			const blob = response.data;
			fileDownload(blob, frameData.name || getNameFile(frameData.url));
		} catch (error) {
			console.error('Error downloading file:', error);
			window.open(frameData.url, '_blank');
		}
		// } else {
		// 	window.open(frameData.url, '_blank');
		// }
	};

	const handlePrev = () => {
		if (currentFileIndex > 0) {
			setCurrentFileIndex(currentFileIndex - 1);
		}
	};

	const handleNext = () => {
		if (currentFileIndex < fileList.length - 1) {
			setCurrentFileIndex(currentFileIndex + 1);
		}
	};

	const getCurrentFileName = (): string => {
		if (fileNameList.length > 0 && fileNameList[currentFileIndex]) {
			return fileNameList[currentFileIndex];
		}
		if (typeof tenFile === 'string') {
			return tenFile;
		}
		return frameData?.name ?? '--';
	};

	if (loading) {
		return (
			<div className='preview-loading' style={style}>
				<Spin size='large' />
			</div>
		);
	}

	if (!file) {
		return <Empty style={{ marginTop: 32, marginBottom: 32 }} description='No file data available' />;
	}

	return (
		<div className='preview-container' style={{ ...style }}>
			<div className='preview-header'>
				<div className='preview-title'>
					<b>{getCurrentFileName()}</b>
				</div>

				<div className='preview-actions'>
					{fileList.length > 1 && (
						<div className='preview-pagination'>
							<ButtonExtend
								type='link'
								disabled={currentFileIndex === 0}
								icon={<LeftOutlined />}
								onClick={handlePrev}
							/>
							<span>
								{currentFileIndex + 1} / {fileList.length}
							</span>
							<ButtonExtend
								type='link'
								disabled={currentFileIndex === fileList.length - 1}
								icon={<RightOutlined />}
								onClick={handleNext}
							/>
						</div>
					)}

					<div className='preview-buttons'>
						{!!frameData?.url && (
							<>
								<ButtonExtend
									type='link'
									tooltip={intl.formatMessage({ id: 'global.previewfile.button.taixuong' })}
									icon={<DownloadOutlined />}
									onClick={handleDownloadOrView}
								/>
								{/* <ButtonExtend
									type='link'
									tooltip={intl.formatMessage({ id: 'global.previewfile.button.saochep' })}
									icon={<CopyOutlined />}
									onClick={handleCopy}
								/> */}
							</>
						)}

						{/* {!!frameData?.src && (
							<ButtonExtend
								type='link'
								tooltip={intl.formatMessage({ id: 'global.previewfile.button.morong' })}
								icon={<ExpandOutlined />}
								onClick={() => window.open(frameData?.src, '_blank')}
							/>
						)} */}

						{children}
					</div>
				</div>
			</div>

			<div className='preview-content'>
				{canPreviewDocx(frameData) ? (
					<DocxViewer data={frameData.data} />
				) : frameData?.type === EDinhDangFile.PDF && frameData?.src ? (
					<div className='preview-pdf'>
						<PDFViewerV2
							data={frameData.data}
							url={!!frameData.data ? undefined : frameData?.src}
							{...props.viewerProps}
						/>
					</div>
				) : frameData?.type === EDinhDangFile.IMAGE && !!frameData?.src ? (
					<div className='preview-image-container'>
						<AuthImage
							src={frameData.src}
							alt={frameData.name}
							style={{
								maxWidth: '100%',
								maxHeight: '100%',
								objectFit: 'contain',
							}}
						/>
					</div>
				) : frameData?.type !== EDinhDangFile.UNKNOWN && !!frameData?.src ? (
					isPrivate ? (
						<div className='preview-error'>
							<p>This document is protected and cannot be previewed directly via Office Online.</p>
							<Button type='primary' icon={<DownloadOutlined />} onClick={handleDownloadOrView}>
								Download to view
							</Button>
						</div>
					) : (
						<iframe src={frameData?.src} className='preview-iframe' />
					)
				) : (
					<div className='preview-error'>
						<p className='preview-error-message'>
							<strong>{intl.formatMessage({ id: 'global.previewfile.thongbao' })}</strong>
						</p>
						{!!frameData?.src && <p className='preview-error-url'>Đường dẫn: {frameData?.src}</p>}
						{!!frameData?.url && (
							<ButtonExtend
								notHideText
								type='link'
								tooltip={intl.formatMessage({ id: 'global.previewfile.button.taixuong' })}
								icon={<FileSearchOutlined />}
								onClick={handleDownloadOrView}
							>
								{intl.formatMessage({ id: 'global.previewfile.button.taixuong' })}
							</ButtonExtend>
						)}
					</div>
				)}
			</div>
		</div>
	);
};

export default PreviewFile;
