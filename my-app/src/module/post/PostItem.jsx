import styled from 'styled-components';
import PostCategory from './PostCategory';
import PostTitle from './PostTitle';
import PostMeta from './PostMeta';
import PostImage from './PostImage';
import slugify from 'slugify';
import PropTypes from 'prop-types';

const PostItemStyles = styled.div`
	display: flex;
	flex-direction: column;
	align-items: flex-start;
	.post {
		&-image {
			height: 202px;
			margin-bottom: 20px;
			display: block;
			width: 100%;
			border-radius: 16px;
		}
		&-category {
			margin-bottom: 16px;
		}
		&-info {
			margin-top: auto;
		}
		&-title {
			margin-bottom: 8px;
		}
	}
`;

/**
 *
 * @param {*} kind true: no display component PostMeta
 */
const PostItem = ({ data, kind = '' }) => {
	const date = data?.createAt?.seconds
		? new Date(data.createAt.seconds * 1000)
		: new Date();
	const formatDate = new Date(date).toLocaleDateString('vi-VI');

	if (!data) return null;
	return (
		<PostItemStyles>
			<PostImage
				url={data?.image || 'Not Update'}
				to={data?.slug}
				className="post-image"
			></PostImage>
			<PostCategory to={data.category.slug}>
				{data?.category?.name}
			</PostCategory>
			<PostTitle to={data.slug} className="three-dot-title">
				{data?.title}
			</PostTitle>
			{!kind && (
				<PostMeta
					className="post-info"
					authorName={data?.user?.fullname}
					to={slugify(data?.user?.username || '', { lower: true })}
					date={formatDate}
				></PostMeta>
			)}
		</PostItemStyles>
	);
};
PostItem.propTypes = {
	data: PropTypes.any,
	kind: PropTypes.bool,
};
export default PostItem;
