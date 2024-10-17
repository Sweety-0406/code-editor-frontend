import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Button } from './button';
import { auth } from '../../config/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from './Navbar';


const schema = z.object({
    groupId: z.string().min(1, { message: 'Required' }),
    username: z.string().min(1, { message: 'Required' }),

});

const EntryForm = ()=>{
    const navigate = useNavigate()
    const [user, setUser] = useState(null)

    useEffect(()=>{
        console.log("mounted")
        const unSubscribe = onAuthStateChanged(auth,async (currentUser)=>{
            if(currentUser){ 
                setUser(currentUser)
                const res = await axios.post('http://localhost:3000/api/v1/users/getUser',{
                    userId: currentUser.uid,
                })
                const fetchedUser = res.data.data.user
                if(fetchedUser.userId === currentUser.uid){
                    console.log(`/group/code-editor=true?id=${fetchedUser.groupId}&username=${fetchedUser.username}&userId=${fetchedUser.userId}`)
                    navigate(`/group/code-editor=true?id=${fetchedUser.groupId}&username=${fetchedUser.username}&userId=${fetchedUser.userId}`);
                }
            }else{
                setUser(null);
            }
        });
        return ()=>unSubscribe();
    },[])
    
    const {
        register,
        handleSubmit,
        formState: { errors },
        } = useForm({
            resolver: zodResolver(schema),
        });
        
        const onClickHandler = async (data)=>{
            console.log(data)
            const { groupId, username } = data;
            console.log(user.uid)
            try {
                const res = await axios.post('http://localhost:3000/api/v1/users/user-entry',{
                    userId: user?.uid,
                    username,
                    groupId
                })
                const fetchedUser = res.data.data
                console.log(fetchedUser)
                // navigate(`/group?id=${fetchedUser.groupId}&username=${fetchedUser.username}&userId=${fetchedUser.userId}`);
                // console.log(`/group/code-editor=true?id=${fetchedUser.groupId}&username=${fetchedUser.username}&userId=${fetchedUser.userId}`)
                navigate(`/group?choice=code-editor&id=${fetchedUser.groupId}&username=${fetchedUser.username}&userId=${fetchedUser.userId}`);
        } catch (error) {
            console.log(error)
        }
    }

    function generateRandomString(length) {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        const charactersLength = characters.length;
        for (let i = 0; i < length; i++) {
          result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }
    const randomStringHandler = ()=>{
        const randomString = generateRandomString(10)
        navigator.clipboard.writeText(randomString)
        toast.success("GroupId is copied to clipboard. Use that.")
    }

    if(!user){
        navigate('/sign-up');
        return;
    }

    return(
        <div className='bg-black'>
            <Navbar />
            <div className='flex items-center justify-center h-screen '>
                <div className='w-96 text-white  rounded-xl shadow-lg p-8 bg-gray-800'>
                    <div className="text-center mb-6">
                        <img className="w-16 mx-auto mb-2"  src="/public/code-editor-icon3.jpg" alt="logo" />
                        <h1 className="text-2xl font-semibold text-white">Online Code Editor</h1>
                    </div>
                    <form className='' onSubmit={handleSubmit(onClickHandler)}>
                        <div className='mb-4'>
                            <input placeholder='Enter GroupId'  className="w-full p-3 rounded-lg bg-gray-700 text-white outline-none focus:ring-2 focus:ring-indigo-500" {...register('groupId')} />
                            {errors.groupId?.message && <p className='text-red-500 text-xs ml-1'>{errors.groupId?.message}</p>}
                        </div>
                        <div className='mb-4'>
                            <input placeholder='Enter Username' className="w-full p-3 rounded-lg bg-gray-700 text-white outline-none focus:ring-2 focus:ring-indigo-500" {...register('username')} />
                            {errors.username?.message && <p className='text-red-500 text-xs ml-1'>{errors.username?.message}</p>}
                        </div>
                        <Button className="w-full p-4 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium shadow-md transition duration-200" type="submit">Submit</Button>
                    </form>
                    <div className='my-2 '>
                        {/* <hr className='bg-blue-400'/> */}
                        <div className='text-center mt-3'>
                            <h1>Don&apos;t have a group? <span onClick={randomStringHandler} className='text-indigo-500 cursor-pointer'>Create group</span></h1>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    )
}


export default EntryForm
