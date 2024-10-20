import { useNavigate } from "react-router-dom"
import {LISTS} from '../constants'
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../config/firebase";
import { useSearchParams } from "react-router-dom";

const Navbar = ()=>{
    const navigate = useNavigate();
    const [user, setUser ] = useState(null)
    const [searchParams] = useSearchParams()
    const groupId = searchParams.get('id');
    const username = searchParams.get('username');
    const userId = searchParams.get('userId');

    useEffect(()=>{
        const unSubscribe = onAuthStateChanged(auth,async (currentUser)=>{
            if(currentUser){
                setUser(currentUser)
            }else{
                setUser(null);
            }
        });
        return ()=>unSubscribe();
    },[])
    
    return(
        <div className="bg-black border-b-[1px] border-gray-400 xl:px-[10%]">
            <div className="text-white items-center flex justify-between mx-5">
                <div>
                <img className="size-10 rounded-full mx-auto my-2"  src="/public/home-logo.png" alt="logo" />
                </div>
                <div className="flex gap-3 text-xl xl:gap-5 ">
                    {LISTS.map((list,ind)=>{
                        return(
                            <div className={`cursor-pointer transition duration-200 `} 
                                onClick={()=>{
                                    if(groupId && username && userId){
                                        navigate(`/group?choice=${list.toLowerCase()}&id=${groupId}&username=${username}&userId=${userId}`);
                                    }else{
                                        navigate(`/${list.toLowerCase()}`)
                                    }
                                }}
                            >
                                {list}
                            </div>
                        )
                    })}
                </div>
                <div>
                    {user ?(
                        <div>
                            <div className="bg-gradient-to-r from-pink-500 to-sky-500 p-2 size-10 text-center rounded-full">
                                {user.email.charAt(0).toUpperCase()}
                            </div>
                        </div>
                    ):(
                        <div>
                            <div className="flex gap-3">
                                <button onClick={()=>navigate('/sign-up')} className="hover:shadow-md bg-indigo-500 p-2 rounded-md hover:shadow-white transition duration-200">Sign-up</button>
                                <button onClick={()=>navigate('/sign-in')} className="hover:shadow-md bg-indigo-500 p-2 px-4 rounded-md hover:shadow-white transition duration-200">Login</button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Navbar