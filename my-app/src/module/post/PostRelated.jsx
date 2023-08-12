import { useEffect, useState } from 'react';
import Heading from '../../components/layout/Heading';
import PostItem from './PostItem';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { db } from '../../firebase/firebase-config';
import PropTypes from 'prop-types';

const PostRelated = ({ categoryId = '' }) => {
	const [posts, setPosts] = useState([]);
	console.log(categoryId);
	useEffect(() => {
		const docRef = query(
			collection(db, 'posts'),
			where('category.id', '==', categoryId)
		);
		onSnapshot(docRef, (snapshot) => {
			const resluts = [];
			snapshot.forEach((doc) => {
				resluts.push({
					id: doc.id,
					...doc.data(),
				});
			});
			setPosts(resluts);
		});
	}, [categoryId]);

	console.log(posts);
	if (!categoryId || posts.length <= 0) return;
	return (
		<div className="post-related">
			<Heading className="!text-[#23BB86]">Bài viết liên quan</Heading>
			<div className="grid-layout grid-layout--primary">
				{posts?.length > 0 &&
					posts.map((item) => {
						return <PostItem key={item.id} data={item}></PostItem>;
					})}
			</div>
		</div>
	);
};
PostRelated.propTypes = {
	categoryId: PropTypes.string,
};
export default PostRelated;
