import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, query, where, onSnapshot, orderBy, addDoc, serverTimestamp, Timestamp, getDoc, doc } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';

// --- URL รูปภาพเริ่มต้นจาก Cloudinary ---
const DEFAULT_ICON_URL = "https://res.cloudinary.com/di8bf7ufw/image/upload/v1754677494/b5ae7146_d3f2_47ec_8c5d_8637f39e1259_removalai_preview_9f237cbeff.png";
const DEFAULT_FRAME_URL = "https://res.cloudinary.com/di8bf7ufw/image/upload/v1754677622/thumbnail_IMG_1694_removebg_preview_4b49eeba14.png";
// ------------------------------------

// --- "พิมพ์เขียว" (Interfaces) ---
interface AuthorInfo {
  isGuest: boolean;
  name: string;
  userId: string;
}
interface Comment {
  id: string;
  text: string;
  createdAt: Timestamp;
  authorInfo: AuthorInfo;
}
interface User { id: number; username: string; }
interface UserProfile { displayName: string; }
interface CommentSectionProps {
  pageId: string;
}

// Component ย่อยสำหรับแสดงผลแต่ละคอมเมนต์
const CommentCard: React.FC<{ comment: Comment }> = ({ comment }) => {
  const isGuest = comment.authorInfo.isGuest;

  return (
    <div className="flex items-start space-x-4 p-4 border-b border-gray-700">
      <div className="w-12 h-12 rounded-full flex-shrink-0 relative">
        {isGuest ? (
          // ถ้าเป็น Guest ให้แสดงวงกลมสีเทา
          <div className="w-full h-full rounded-full bg-gray-600" />
        ) : (
          // ถ้าเป็นสมาชิก ให้แสดงไอคอนและกรอบจาก Cloudinary
          <>
            <img 
              src={DEFAULT_ICON_URL} 
              alt="User Icon" 
              className="w-full h-full object-cover rounded-full" 
            />
            <img 
              src={DEFAULT_FRAME_URL} 
              alt="User Frame" 
              className="absolute top-0 left-0 w-full h-full object-contain" 
            />
          </>
        )}
      </div>
      
      <div>
        <p className="font-bold text-gray-200">{comment.authorInfo.name}</p>
        <p className="text-gray-300">{comment.text}</p>
        <p className="text-xs text-gray-500 mt-1">
          {comment.createdAt?.toDate().toLocaleString() ?? 'Just now'}
        </p>
      </div>
    </div>
  );
};

// Component หลัก
const CommentSection: React.FC<CommentSectionProps> = ({ pageId }) => {
  const { user, profile, isLoggedIn } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState<string>('');
  
  useEffect(() => {
    if (!pageId) return;
    const commentsRef = collection(db, 'comments');
    const q = query(commentsRef, where('pageId', '==', pageId), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const commentsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as Comment[];
      setComments(commentsData);
    });
    return () => unsubscribe();
  }, [pageId]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (newComment.trim() === '') return;

    let authorInfo: AuthorInfo;

    if (isLoggedIn && user && profile) {
      authorInfo = {
        isGuest: false,
        name: profile.displayName || user.username,
        userId: user.id.toString(),
      };
    } else {
      let guestName = localStorage.getItem('guestName');
      if (!guestName) {
        guestName = `Guest-${Math.floor(1000 + Math.random() * 9000)}`;
        localStorage.setItem('guestName', guestName);
      }
      authorInfo = {
        isGuest: true,
        name: guestName,
        userId: '',
      };
    }

    await addDoc(collection(db, 'comments'), {
      pageId: pageId,
      text: newComment,
      createdAt: serverTimestamp(),
      authorInfo: authorInfo,
    });
    setNewComment('');
  };

  return (
    <div className="bg-gray-800 text-white p-6 rounded-lg mt-8">
      <h3 className="text-2xl font-bold mb-4">Comments</h3>
      <form onSubmit={handleSubmit} className="mb-6">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder={isLoggedIn ? `Commenting as ${profile?.displayName || user?.username}...` : 'Comment as Guest...'}
          className="w-full p-3 bg-gray-700 text-gray-100 rounded-md border border-gray-600"
          rows={3}
        ></textarea>
        <button type="submit" className="mt-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md">
          Post Comment
        </button>
      </form>
      <div className="space-y-4">
        {comments.map((comment) => (
          <CommentCard key={comment.id} comment={comment} />
        ))}
        {comments.length === 0 && (
          <p className="text-gray-500 text-center">Be the first to comment!</p>
        )}
      </div>
    </div>
  );
};

export default CommentSection;