import PostFeatureItem from '../post/PostFeatureItem';
import styled from 'styled-components';
import Heading from '../../components/layout/Heading';
import { useEffect, useState } from 'react';
import {
	collection,
	limit,
	onSnapshot,
	query,
	where,
} from 'firebase/firestore';
import { db } from './../../firebase/firebase-config';

const HomeFeatureStyles = styled.div`
	padding-top: 60px;
`;

const HomeFeature = () => {
	const [posts, setPosts] = useState([]);

	useEffect(() => {
		const colRef = collection(db, 'posts');
		const queries = query(
			colRef,
			where('status', '==', 1),
			where('hot', '==', true),
			limit(3)
		);
		//onSnapshot có khả năng theo dõi và cập nhật thời gian thực khi có sự thay đổi trong dữ liệu Firestore.
		onSnapshot(queries, (snapshot) => {
			const results = [];
			snapshot.forEach((doc) => {
				results.push({
					id: doc.id,
					...doc.data(),
				});
			});
			setPosts(results);
		});
	}, []);

	if (posts.length <= 0) return;

	return (
		<HomeFeatureStyles className="home-block">
			<div className="container">
				<Heading>Bài viết nổi bật</Heading>
				<div className="grid-layout">
					{posts.map((post) => (
						<PostFeatureItem key={post.id} data={post}></PostFeatureItem>
					))}
				</div>
			</div>
		</HomeFeatureStyles>
	);
};

export default HomeFeature;
