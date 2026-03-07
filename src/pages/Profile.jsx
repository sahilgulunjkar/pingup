import React, { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { dummyPostsData, dummyUserData } from '../assets/assets'
import Loading from '../components/Loading'
import UserProfileInfo from '../components/UserProfileInfo'
import Postcard from '../components/Postcard'
import moment from 'moment'

const Profile = () => {

  const { profileId } = useParams();
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [activeTab, setActiveTab] = useState('posts');
  const [showEdit, setShowEdit] = useState(false);

  const fetchUser = async () => {
    setUser(dummyUserData);
    setPosts(dummyPostsData);
  }

  useEffect(() => {
    fetchUser();
  }, []);

  return user ? (
    <div className='relative h-full overflow-y-scroll bg-gray-50 p-6'>
      <div className="max-w-3xl mx-auto">

        {/* Profile Card */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Cover Page */}
          <div className="h-40 md:h-56 bg-gradient-to-r from-indigo-500 to-purple-500">
            {user.cover_photo && <img src={user.cover_photo} alt="" className="w-full h-full object-cover" />}
          </div>

          {/* User Info */}
          <UserProfileInfo user={user} posts={posts} profileId={profileId} setShowEdit={setShowEdit} />
        </div>

        {/* Tabs */}
        <div className="mt-6">
          <div className="bg-white rounded-lg shadow-lg flex max-w-md mx-auto">
            {
              ["posts", "media", "likes"].map((tab) => (
                <button
                  className={`flex-1 py-2 text-center text-sm font-medium cursor-pointer ${activeTab === tab ? "bg-gray-100 text-indigo-600" : "text-gray-600 hover:text-gray-900"}`}
                  key={tab}
                  onClick={() => setActiveTab(tab)}>
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))
            }
          </div>

          {/* Posts */}
          {activeTab === "posts" && (
            <div className="mt-6 flex flex-col items-center gap-4">
              {posts.map((post) => (
                <Postcard key={post._id} post={post} />
              ))}
            </div>
          )}

          {/* Media */}
          {activeTab === "media" && (
            <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-2 md:gap-4 text-center">
              {
                posts.filter((post) => post.image_urls.length > 0).map((post) => (
                  <React.Fragment key={post._id}>
                    {post.image_urls.map((image, index) => (
                      <Link
                        className='relative group flex-shrink-0'
                        target='_blank'
                        to={image}
                        key={index}
                      >
                        <img
                          className='w-full aspect-square object-cover rounded-lg'
                          src={image}
                          alt=""
                        />
                        <p className='absolute bottom-0 right-0 text-xs p-1 px-3 backdrop-blur-xl text-white opacity-0 group-hover:opacity-100 transition duration-300'>
                          Posted {moment(post.createdAt).fromNow()}
                        </p>
                      </Link>
                    ))}
                  </React.Fragment>
                ))
              }
            </div>
          )}
        </div>

      </div>
      {/* Edit Profile Model */}
      {showEdit && <ProfileModel setShowEdit={setShowEdit}/>}
    </div>
  ) : (<Loading />)
}

export default Profile