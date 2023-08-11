import { doc, getDoc } from 'firebase/firestore';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { db } from '../../firebase/firebase-config';

const AuthorBox = ({ userId = '' }) => {
	const [user, setUser] = useState({});
	useEffect(() => {
		async function fetchUserData() {
			const docRef = doc(db, 'users', userId);
			const docData = await getDoc(docRef);
			if (docData.data()) {
				setUser(docData.data());
			}
		}
		fetchUserData();
	}, [userId]);

	if (!userId || !user.email) return null;
	return (
		<div className="author">
			<div className="author-image">
				<img src={user?.avatar} alt="Not Update" />
			</div>
			<div className="author-content">
				<h3 className="author-name">{user?.fullname || 'Not Update'}</h3>
				<p className="author-desc">
					{user?.description ||
						`Author ${user?.fullname} not update description`}
				</p>
			</div>
		</div>
	);
};
AuthorBox.propTypes = {
	userId: PropTypes.any,
};
export default AuthorBox;
