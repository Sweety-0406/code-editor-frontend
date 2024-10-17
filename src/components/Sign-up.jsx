import { useState } from 'react';
import { auth } from '../../config/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';

const SignUp = () => {
  const navigate = useNavigate()
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleCreateUser = async (e) => {
    e.preventDefault();
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      console.log('User created successfully');
      navigate('/sign-in')
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className='w-full h-screen bg-no-repeat bg-center bg-cover'
      style={{
        backgroundImage:`url('/bg2.png')`
      }}
    >
        <Navbar  />
        <div className='pt-32'>
        <div className='flex justify-between backdrop-blur-md border rounded-xl overflow-hidden shadow-white shadow-md p-10  mx-[20%] items-center'>
            <div className='max-w-md text-white'>
                <h2 className='text-7xl mb-2'>Register</h2>
                <p>
                    Lorem, ipsum dolor sit amet consectetur adipisicing elit. Excepturi, blanditiis quod, quia, vero totam porro expedita modi doloremque nulla unde dolorem magni. Atque!
                </p>
            </div>             
            <div className='border text-black p-4 rounded-md backdrop-blur-lg min-w-96'>
            <h2 className='text-center text-2xl text-sky-500 border-b mb-2 pb-2 font-bold'>Register your Account</h2>
            <form onSubmit={handleCreateUser}>
                <div className=''>
                <label className='text-sky-500'>Name</label><br />
                <input
                    className='rounded-md p-1 w-full '
                    type='text'
                    id='name'
                    name='name'
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                </div>

                <div>
                <label className='text-sky-500' htmlFor='email'>Email</label><br />
                <input
                    className='rounded-md p-1 w-full '
                    type='email'
                    id='email'
                    name='email'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                </div>

                <div>
                <label className='text-sky-500' htmlFor='password'>Password</label><br />
                <input
                    className='rounded-md p-1 w-full '
                    type='password'
                    id='password'
                    name='password'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                </div>

                <div>
                <label className='text-sky-500' htmlFor='confirm_password'>
                    Confirm Password
                </label>
                <br />
                <input
                    className='rounded-md p-1 w-full '
                    type='password'
                    id='confirm_password'
                    name='confirm_password'
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                />
                </div>

                <div>
                {/* <div>
                    <input
                    type='checkbox'
                    id='terms'
                    name='terms'
                    className='mr-2'
                    />
                    <label htmlFor='terms'>
                    I agree to the{' '}
                    <a href='#'>
                        Terms and Conditions
                    </a>
                    </label>
                </div> */}
                </div>

                <button className='bg-sky-600 text-white hover:bg-sky-700 border rounded-md mt-3 p-2 hover:shadow-md  hover:shadow-white ' type='submit'>
                    Register
                </button>
            </form>
            <div className='border-t text-white mt-2 text-center'>
                Already have an account?
                <span className='text-sky-500 cursor-pointer' onClick={()=>{navigate('/sign-in')}}> Login</span>
            </div>
            </div>  
        </div>  
        </div>   
    </div>
  );
};

export default SignUp;