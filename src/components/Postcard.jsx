import react from 'react'
import { BadgeCheck} from 'lucide-react'
import moment from 'moment'
const Postcard = ({ post }) => {
    return (
        <div className="bg-white rounded-lg shadow-md p-4 space-y-4 w-full max-w-2xl">
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
        </div>
    )
}

export default Postcard