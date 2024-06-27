import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useNavigate } from 'react-router-dom';
import {v4 as uuidV4} from 'uuid'
import toast from 'react-hot-toast';


const schema = z.object({
    groupId: z.string().min(1, { message: 'Required' }),
    username: z.string().min(1, { message: 'Required' }),

});

const EntryForm = ()=>{
    const navigate = useNavigate()
    const userId = uuidV4()

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(schema),
    });

    const onClickHandler = (data)=>{
        console.log(data)
        const { groupId, username } = data;
        navigate(`/group?id=${groupId}&username=${username}&userId=${userId}`);
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

    return(
        <div className='bg-slate-900'>
            <div className='flex items-center justify-center h-screen '>
                <div className='w-full max-w-[50%] text-white font-serif border-2 rounded-2xl  bg-gradient-to-b from-slate-700 p-3'>
                    <div className="flex justify-center">
                        <img className='w-10 h-10  rounded-lg' src="/public/code-editor-icon2.jpg" alt="" />
                        <h1 className='items-center my-auto font-bold  ml-2 text-2xl'>Online Code Editor</h1>
                    </div>
                    <div className='my-2'>
                        <hr />
                        <hr />
                        <hr />
                    </div>
                    <form className='' onSubmit={handleSubmit(onClickHandler)}>
                        <input placeholder='Enter GroupId'  className='w-full p-[7px] m-1 mx-auto bg-transparent border rounded-md ' {...register('groupId')} />
                        {errors.groupId?.message && <p>{errors.groupId?.message}</p>}
                        <input placeholder='Enter Username' className='w-full p-[7px] m-1 mx-auto bg-transparent border rounded-md' {...register('username')} />
                        {errors.username?.message && <p>{errors.username?.message}</p>}
                        <button className='border bg-green-500 p-1 px-2 rounded-lg mt-2' type="submit">submit</button>
                    </form>
                    <div className='my-2 '>
                        <hr className='bg-blue-400'/>
                        <div className='text-center mt-3'>
                            <h1>Don&apos;t have an account? <span onClick={randomStringHandler} className='text-blue-400 cursor-pointer'>Create group</span></h1>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}


export default EntryForm
