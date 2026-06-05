import axios from '@/utils/axios';
import { getFileIdFromValue, getPreviewUrl } from '@/utils/utils';
import { Image } from 'antd';
import { useEffect, useState } from 'react';

type AuthImageProps = {
	src?: string;
	fallback?: string;
	alt?: string;
	style?: React.CSSProperties;
	className?: string;
	isDetail?: boolean;
	preview?: any; // <-- Bổ sung prop này
};

const cache = new Map<string, string>();

const AuthImage: React.FC<AuthImageProps> = ({ src, fallback = '', alt = '', className, isDetail, style, preview }) => {
	const [imgSrc, setImgSrc] = useState<string>(fallback);

	useEffect(() => {
		if (!src) {
			setImgSrc(fallback);
			return;
		}

		const isProxyFileUrl = src.includes('/file/') && /[?&]proxy=1(?:&|$)/.test(src);
		const shouldResolveFileUrl = !isProxyFileUrl && (!!getFileIdFromValue(src) || src.includes('/file/'));

		if (!shouldResolveFileUrl && (/^(data|blob):/.test(src) || !/^https?:\/\//.test(src))) {
			setImgSrc(src);
			return;
		}

		let objectUrl: string | undefined;
		let isMounted = true;

		const fetchImage = async () => {
			try {
				const resolvedSrc = shouldResolveFileUrl ? await getPreviewUrl(src) : src;

				if (cache.has(resolvedSrc)) {
					if (isMounted) setImgSrc(cache.get(resolvedSrc)!);
					return;
				}

				const res = await axios.get(resolvedSrc, {
					responseType: 'blob',
					data: { silent: true },
				});

				objectUrl = URL.createObjectURL(res.data);
				cache.set(resolvedSrc, objectUrl);

				if (isMounted) setImgSrc(objectUrl);
			} catch {
				if (isMounted) setImgSrc(fallback);
			}
		};

		fetchImage();

		return () => {
			isMounted = false;
		};
	}, [src, fallback]);

	if (isDetail) {
		// Ghi đè src của preview bằng ảnh blob đã được fetch qua axios
		return (
			<Image
				src={imgSrc}
				alt={alt}
				className={className}
				style={style}
				preview={preview ? { ...preview, src: imgSrc } : undefined}
			/>
		);
	}

	return <img src={imgSrc} alt={alt} className={className} style={style} />;
};

export default AuthImage;
