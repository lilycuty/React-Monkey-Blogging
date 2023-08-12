import { useEffect, useState } from 'react';
import Layout from '../../components/layout/Layout';
import Heading from '../../components/layout/Heading';
import { useParams } from 'react-router-dom';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { db } from '../../firebase/firebase-config';
import PostItem from '../post/PostItem';

const UserListPost = () => {
	const { slug } = useParams();
	const [posts, setPosts] = useState([]);
	useEffect(() => {
		const docRef = query(
			collection(db, 'posts'),
			where('user.username', '==', slug)
		);
		onSnapshot(docRef, (snapshot) => {
			const results = [];
			snapshot.forEach((doc) => {
				results.push({
					id: doc.id,
					...doc.data(),
				});
			});
			setPosts(results);
		});
	}, [slug]);
	if (!slug) return;
	return (
		<div>
			<Layout>
				<div className="container">
					<Heading className="mt-10">DANH SÁCH BÀI VIẾT</Heading>
					<div className="grid-layout grid-layout--primary">
						{posts?.length > 0 &&
							posts.map((item) => (
								<PostItem key={item.id} data={item} kind></PostItem>
							))}
					</div>
				</div>
			</Layout>
		</div>
	);
};

export default UserListPost;
