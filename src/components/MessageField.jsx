import { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import ProfilePage from './ProfilePage';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import useSound from 'use-sound';
import PropTypes from 'prop-types'

const MessageField = ({groupId, username, userId}) =>{
    const [data, setData] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [socket, setSocket] = useState(null);
    const [groupMembers, setGroupMembers] = useState([]);
    const navigate = useNavigate();
    const color = ['bg-green-600','bg-red-600', 'bg-yellow-500', 'bg-sky-600', 'bg-violet-600', 'bg-orange-400','bg-pink-500', 'bg-rose-500','bg-blue-600','bg-fuchsia-500', 'bg-lime-500', 'bg-teal-500'];
    const ind = Math.floor(Math.random() * color.length);
    const [playSound] = useSound('/public/sound.mp3');
    const [msgPlaySound] = useSound('/public/water_droplet.mp3');

    useEffect(() => {
        const frontendUrl = import.meta.env.VITE_FRONTEND_URL;
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
            socket.emit('chat-message', { groupId, msg: inputValue, username });
            setInputValue('');
        }
    };

    const OnLeaveHandler = () => {
        socket.emit('leave-chat', groupId, userId);
        navigate('/');
    }


    return (
        <div>
            <div className='grid grid-cols-5'>
                <div className='border-r bg-slate-600 col-span-2'>
                    <ProfilePage groupMembers={groupMembers} groupId={groupId} clickHandler={OnLeaveHandler} />
                </div>
                <div className='m-3 text-white col-span-3'>
                    <div className='text-xl font-serif font-bold pb-2'>
                        Chat Box
                    </div>
                    <div>
                        <hr />
                        <hr />
                        <hr />
                        <hr />
                    </div>
                    <div className='border-2 px-1 rounded-lg mt-2'>
                        <div className='max-h-[82vh] h-[82vh] rounded-md mb-2 overflow-y-scroll'>
                            <ul id="messages">
                                {data.map((d, index) => (
                                    <li
                                        key={index}
                                        className={`
                                          px-2 
                                          py-1
                                        `}
                                    >
                                        <strong className={`${d.username === username ? 'text-blue-400' : 'text-green-400'}`}>{d.username === username ? 'You' : d.username}:</strong> {d.msg}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className='mb-1'>
                            <form className='flex justify-between' id="form" onSubmit={handleSubmit}>
                                <input
                                    className='text-black p-2 w-5/6 border-[2px] border-blue-500 rounded-md'
                                    id="input"
                                    type="text"
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                />
                                <button className='bg-blue-400 p-2 rounded-xl ml-1' type="submit">Send</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

MessageField.propTypes = {
    groupId: PropTypes.string.isRequired,
    username: PropTypes.string.isRequired,
    userId: PropTypes.string.isRequired,
} 

export default MessageField;
