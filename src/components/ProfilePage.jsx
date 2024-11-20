
import PropTypes from 'prop-types'
import toast from 'react-hot-toast';
import { TbDeviceImacCode } from "react-icons/tb";
import { PiChalkboardSimpleBold } from "react-icons/pi";
import { PiChatsCircleBold } from "react-icons/pi";

const ProfilePage = ({groupId,groupMembers, clickHandler, choice})=>{
    
    const copyHandler = ()=>{
        navigator.clipboard.writeText(groupId)
        toast.success("GroupId is copied to clipboard.")
    }
    console.log(groupMembers)

    return(
        <div className="m-1 mt-[6px] text-white h-screen">
            <div className='text-lg font-serif font-bold pb-2'>
                {choice =='code-editor' && 
                    <div className="flex text-orange-500">
                        <TbDeviceImacCode className='size-8' />
                        <div className='flex '>
                            <div className="hidden xl:block ml-2 my-auto">Online Code Editor</div>
                            <div className="block xl:hidden ml-2 my-auto">Editor</div>
                        </div>
                    </div>
                }
                {choice =='board' && 
                    <div className="flex text-purple-500">
                        <PiChalkboardSimpleBold className='size-8' />
                        <div className='flex '>
                            <div className=" xl:block ml-2 my-auto"> Board</div>
                        </div>
                    </div>
                }
                {choice =='chat' && 
                    <div className="flex text-green-500">
                        <PiChatsCircleBold className='size-8' />
                        <div className='flex'>
                            <div className=" ml-2 my-auto">Chat</div>
                        </div>
                    </div>
                }
            </div>
            <div className=''>
                <hr />
            </div>
            <div>
            <div className="border border-gray-500 p-1 px-2 mt-2 font-serif overflow-y-scroll scrollbar-hide  rounded-md h-[68vh]">
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
                <button onClick={copyHandler} className="bg-green-500/55 hover:shadow-md hover:shadow-white shadow-white shadow-sm p-2 mt-2 items-center text-center rounded-md w-full">Copy GroupId</button>
            </div>
            <div>
                <button onClick={clickHandler} className="bg-red-500/55 hover:shadow-md hover:shadow-white shadow-white shadow-sm p-2 mt-2 items-center text-center rounded-md w-full">Leave Group</button>
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