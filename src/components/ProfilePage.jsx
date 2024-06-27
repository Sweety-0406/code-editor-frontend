import PropTypes from 'prop-types'
import toast from 'react-hot-toast';

const ProfilePage = ({groupId,groupMembers, clickHandler})=>{
    
    const copyHandler = ()=>{
        navigator.clipboard.writeText(groupId)
        toast.success("GroupId is copied to clipboard.")
    }

    return(
        <div className="m-3 mt-[2px] text-white h-screen">
            <div className='text-lg font-serif font-bold pb-2'>
                <div className="flex">
                    <img className="w-10 h-10 rounded-md" src="/public/code-editor-icon2.jpg" alt="" />
                    <div className="hidden xl:block ml-2 my-auto">Online Code Editor</div>
                    <div className="block xl:hidden ml-2 my-auto">Editor</div>
                </div>
            </div>
            <div>
                <hr />
                <hr />
                <hr />
                <hr />
            </div>
            <div>
            <div className="border-2 p-1 px-2 mt-2 font-serif overflow-y-scroll rounded-md h-[76vh]">
                <ul className=''>
                    {groupMembers.map((member, index) => (
                        <li key={index} className='flex'>
                            <div className={`${member.color} rounded-full p-2 w-10 h-10 items-center text-center mt-2`} >
                                {member.username[0].toUpperCase()}
                            </div>
                            <div className='hidden md:block ml-1 my-auto'>
                               <h1>{member.username}</h1>
                            </div>
                        </li>
                    ))} 
                </ul>
            </div>
            <div>
                <button onClick={copyHandler} className="bg-green-600 p-2 mt-2 items-center text-center rounded-md w-full">Copy GroupId</button>
            </div>
            <div>
                <button onClick={clickHandler} className="bg-red-500 p-2 mt-2 items-center text-center rounded-md w-full">Leave Group</button>
            </div>
            </div>
        </div>
    )
}


ProfilePage.propTypes = {
    groupId: PropTypes.string.isRequired,
    groupMembers: PropTypes.arrayOf(PropTypes.shape({
        username: PropTypes.string.isRequired,
        color: PropTypes.string.isRequired,
    })),
    clickHandler: PropTypes.func.isRequired
}

export default ProfilePage