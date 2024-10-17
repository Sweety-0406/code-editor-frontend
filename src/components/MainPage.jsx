import { useState,React, useEffect } from 'react';
import MessageField from './MessageField';
import CodeField from './CodeField';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../config/firebase';
import axios from 'axios';
import Navbar from './Navbar';

function MainPage() {
  const location = useLocation();
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const choice = searchParams.get('choice')
  const groupId = searchParams.get('id');
  const username = searchParams.get('username');
  const userId = searchParams.get('userId');
  const [socket, setSocket] = useState(null);
  const[hostId, setHostId] = useState(null);
  const[isOpen, setIsOpen] = useState(true);

  useEffect(()=>{
    const unSubscribe = onAuthStateChanged(auth,async (currentUser)=>{
      if(currentUser){
        try {
          const res = await axios.post('http://localhost:3000/api/v1/users/getUser',{
            userId:currentUser.uid,
          })
          const fetchedUser = res.data.data.user
          if(fetchedUser.userId != userId){
            navigate('/sign-up');
          }
        } catch (error) {
          navigate('/sign-up');
        }
      }else{
        navigate('/sign-up');
        // setUser(null);
      }
    });
    return ()=>unSubscribe();
  },[])

  const isOpenFun=()=>{
    setIsOpen((val)=>!val)
  }
  return (
    <div>
      <div className=''>
      <Navbar /> 
      </div>
      <div className='grid grid-cols-10 h-screen'>
        <div className={`
          ${choice=="chat"? "col-span-10":"col-span-2"} 
          bg-black`}>
        <MessageField onClickHandler={isOpenFun} choice={choice} isOpen={isOpen} hostId={hostId} setHostId={setHostId} socket={socket} setSocket={setSocket} groupId={groupId} username={username} userId={userId} />
        </div>
        {choice!="chat" && <div className="col-span-8 bg-slate-700 border-l">
          <CodeField hostId={hostId} socket={socket} setSocket={setSocket} groupId={groupId} userId={userId} choice={choice} />
        </div>}
      </div>
    </div>
  );
}

export default MainPage;


