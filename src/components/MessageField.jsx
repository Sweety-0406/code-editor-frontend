
import { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import ProfilePage from './ProfilePage';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import useSound from 'use-sound';
import PropTypes from 'prop-types'
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';


const MessageField = ({hostId, setHostId, groupId, username, userId, socket, setSocket, choice}) =>{
    const [data, setData] = useState([]);
    const naviagation = useNavigate()
    const [inputValue, setInputValue] = useState('');
    // const [socket, setSocket] = useState(null);
    const [groupMembers, setGroupMembers] = useState([]);
    const navigate = useNavigate();
    const color = ['bg-green-600','bg-red-600', 'bg-yellow-500', 'bg-sky-600', 'bg-violet-600', 'bg-orange-400','bg-pink-500', 'bg-rose-500','bg-blue-600','bg-fuchsia-500', 'bg-lime-500', 'bg-teal-500'];
    const ind = Math.floor(Math.random() * color.length);
    const [playSound] = useSound('/sound.mp3');
    const [msgPlaySound] = useSound('/water_droplet.mp3');
    const date = new Date();
    const hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0');

    const showTime = `${hours}:${minutes}`; 
    const messagesEndRef = useRef(null);

    // Scroll to the bottom whenever data (messages) changes
    useEffect(() => {
        if(messagesEndRef.current){
            messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight
        }
        console.log(data)
    }, [data]);


    useEffect(() => {
        const frontendUrl = import.meta.env.VITE_BACKEND_URL;
        console.log(frontendUrl);
 
        const newSocket = io(frontendUrl) // Adjust this URL if your backend is running elsewhere
        setSocket(newSocket);

        newSocket.emit('join-chat', groupId, username, userId, color[ind]);
        newSocket.on('chat message', (data) => {
            msgPlaySound() 
            console.log("New message received: ", data);
            setData((prevData) => [...prevData, data]);
        });

        newSocket.on('new-member', (members) => {
            console.log('New member list:', members);
            playSound()
            setGroupMembers(members);
            setHostId(members[0].userId)
            console.log(hostId)       
        });

        axios.get(`${frontendUrl}/group-members/${groupId}`)
            .then(response => {
                console.log(response.data);
                setGroupMembers(response.data);
            })
            .catch(error => {
                console.error('Error fetching group members:', error);
            }); 

        return () => {
            newSocket.emit('leave-chat', groupId, userId);
            newSocket.disconnect();
        };

    }, [groupId, username, userId ]); 

    const handleSubmit = (e) => {
        e.preventDefault();
        if (inputValue) {
            console.log("Sending message: ", inputValue);
            socket.emit('chat-message', { groupId, msg: inputValue, username, time:showTime });
            setInputValue('');
        }
    };

    const OnLeaveHandler = async() => {
        try {
            console.log("userid"+userId)
            await axios.post('http://localhost:3000/api/v1/users/logOut',{userId})
            socket.emit('leave-chat', groupId, userId);
            navigate('/');
        } catch (error) {
            toast.error("something went wrong")
        }
    }

    


    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
        >
            <div className={`
                    grid 
                    ${choice=='chat'?"grid-cols-10":"grid-cols-2"}
                `}>
                <div className={`
                    bg-black 
                    col-span-2
                `}>
                    <ProfilePage  groupMembers={groupMembers} groupId={groupId} clickHandler={OnLeaveHandler} choice={choice}/>
                </div>
                <div className={`
                        
                        text-white
                        col-span-8
                        
                    `}>
                    {choice=='chat' && (
                        <motion.div
                            initial={{ opacity: 0,x:-10 }} // Starts off-screen to the left
                            animate={{ opacity: 1, x: 0 }} // Slides to its original position
                            transition={{ duration: 0.6 }}
                            className='border-l-2 border-purple-300'
                        >
                            <div className='bg-gray-800'>
                                <div className='text-xl flex mx-3 pt-3  font-serif font-bold pb-2'>
                                    Chat Box 
                                </div>
                            </div>
                            <div className=' pt-2 bg-cover bg-no-repeat bg-center z-0'
                                style={{
                                    backgroundImage:`url('/chat.png')`
                                }}
                            >
                                <div ref={messagesEndRef} className='max-h-[74vh] h-[74vh]  z-10  rounded-md mb-2 scroll- overflow-y-scroll scrollbar-hide'>
                                    <ul id="messages">
                                        {data.map((d, index) => (
                                            <li
                                                key={index}
                                                className={`
                                                px-4 
                                                py-2
                                                flex
                                                ${d.username === username ? 'text-right  justify-end' : 'text-left justify-start'}
                                                `}
                                            >
                                                <p className= {`
                                                     
                                                    ${d.username === username ? 'bg-teal-900 outgoing-bubble' : 'bg-gray-700 incoming-bubble'}
                                                    rounded-md 
                                                    pb-2 
                                                    px-2
                                                    text-left
                                                    max-w-sm
                                                    lg:max-w-md
                                                    xl:max-w-lg
                                                    break-words
                                                    `} 
                                                >
                                                    <strong className={`
                                                        ${d.username === username ? 'text-blue-400 ' : 'text-green-500 '}`}
                                                    >
                                                        {d.username === username ? 'You: ' : d.username+": "} 
                                                    </strong> 
                                                    {d.msg}
                                                    <div className={`
                                                        text-xs
                                                        ml-1
                                                        text-gray-400
                                                        text-end
                                                        -mt-[6px]
                                                        -mb-1
                                                          ${d.username === username?"":""}
                                                    `}>
                                                        {d.time}
                                                    </div>
                                                </p>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div className='mb-1 bg-gray-800 py-2'>
                                    <form className='flex gap-2 ml-4' id="form" onSubmit={handleSubmit}>
                                        <input
                                            placeholder='Enter your text here . . .'
                                            className='text-white bg-gray-700 p-2 w-5/6  rounded-md outline-none focus:ring-2 focus:ring-indigo-500'
                                            id="input"
                                            type="text"
                                            value={inputValue}
                                            onChange={(e) => setInputValue(e.target.value)}
                                        />
                                        <button className='bg-blue-400 p-2 px-4 rounded-xl ml-1' type="submit">Send</button>
                                    </form>
                                </div>
                            </div>
                        </motion.div>
                        )
                    }
                </div>
            </div>
        </motion.div>
    );
}

MessageField.propTypes = {
    groupId: PropTypes.string.isRequired,
    username: PropTypes.string.isRequired,
    userId: PropTypes.string.isRequired,
} 

export default MessageField;
