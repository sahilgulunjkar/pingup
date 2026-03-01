import React from 'react'

const Loading = ({ height = '50vh' }) => {
    return (
        <div style={{ height }} className='flex items-center justify-center w-full'>
            <div className='w-10 h-10 rounded-full border-4 border-indigo-500 border-t-transparent animate-spin'>
            
            </div>
        </div>
    )
}

export default Loading