import { useState } from 'react'
import { BadgeCheck, Heart, Share2 } from 'lucide-react'
import moment from 'moment'
import { dummyUserData } from '../assets/assets'
import { MessageCircle } from 'lucide-react'


const Postcard = ({ post }) => {
      const postWithHashtags = post.content.replace(/#(\w+)/g, '<span class="text-blue-500">#$1</span>')
      const [likes, setLikes] = useState(post.likes_count)
      const currentUser = dummyUserData
      const handleLike= async () => {

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
                    <div className="text-sm text-gray-500">@{post.user.username} . { moment(post.createdAt).fromNow()}</div>
                </div>
            </div>
            {/* Post Content */}
             {post.content && <div className="text-gray-800 whitespace-pre-line" dangerouslySetInnerHTML={{__html:postWithHashtags}}></div>}

             {/* Post Image */}
             <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {post.image_urls.map((img, index) =>(
                    <img key={index} src={img} className={`w-full h-48 object-cover 
                    rounded-lg ${post.image_urls.length === 1 && 'col-span-2 h-auto' }`} 
                    alt=""/>     )) }
             </div>
                
               {/* Post Actions */}
                <div className="flex items-center gap-8 text-gray-500 
                text-sm pt-2 border-t border-gray-300">
                    <div className="flex items-center gap-1">   
                       <Heart className={`w-5 h-5 cursor-pointer ${likes.includes(currentUser.id) && 'text-red-500 fill-red-500'}`} onlcick
                       ={handleLike} />
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