import { useState } from 'react'
import { BadgeCheck, Heart, Share2 } from 'lucide-react'
import moment from 'moment'
import { MessageCircle } from 'lucide-react'
import { useSelector } from 'react-redux'
import { useAuth } from '@clerk/clerk-react'
import api from '../api/axios'
import toast from 'react-hot-toast'

const Postcard = ({ post }) => {
    const postWithHashtags = post.content.replace(/#(\w+)/g, '<span class="text-blue-500">#$1</span>')
    const [likes, setLikes] = useState(post.likes || post.likes_count || [])
    const currentUser = useSelector((state) => state.user.value)

    const { getToken } = useAuth()
    
    const handleLike = async () => {
        try {
            const { data } = await api.post('/api/post/like', { postId: post._id }, {
                headers: {
                    Authorization: `Bearer ${await getToken()}`
                }
            })

            if (data.success) {
                toast.success(data.message)
                setLikes(prev => {
                    if (prev.includes(currentUser._id)) {
                        return prev.filter(id => id !== currentUser._id)
                    } else {
                        return [...prev, currentUser._id]
                    }
                })
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }
    return (
        <div className="bg-white rounded-lg shadow-md p-4 space-y-4 w-full max-w-2xl">
            {/* User Info and Timestamp */}
            <div className="flex items-center gap-3">
                <img src={post.user.profile_picture} alt="" className="w-10 h-10 rounded-full shadow" />
                <div>
                    <div>
                        <span>{post.user.full_name}</span>
                        <BadgeCheck className="w-4 h-4 ml-2 text-blue-500" />
                    </div>
                    <div className="text-sm text-gray-500">@{post.user.username} . {moment(post.createdAt).fromNow()}</div>
                </div>
            </div>
            {/* Post Content */}
            {post.content && <div className="text-gray-800 whitespace-pre-line" dangerouslySetInnerHTML={{ __html: postWithHashtags }}></div>}

            {/* Post Image */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {post.image_urls.map((img, index) => (
                    <img key={index} src={img} className={`w-full h-48 object-cover 
                    rounded-lg ${post.image_urls.length === 1 && 'col-span-2 h-auto'}`}
                        alt="" />))}
            </div>

            {/* Post Actions */}
            <div className="flex items-center gap-8 text-gray-500 
                text-sm pt-2 border-t border-gray-300">
                <div className="flex items-center gap-1">
                    <Heart className={`w-5 h-5 cursor-pointer ${likes.includes(currentUser?._id) && 'text-red-500 fill-red-500'}`} onClick={handleLike} />
                    <span>{likes.length}</span>
                </div>
                <div className="flex items-center gap-1">
                    <MessageCircle className="w-4 h-4 cursor-pointer" />
                    <span>{12}</span>
                </div>
                <div className="flex items-center gap-1">
                    <Share2 className="w-4 h-4 cursor-pointer" />
                    <span>{7}</span>
                </div>
            </div>
        </div>
    )
}


export default Postcard