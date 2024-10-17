import { useState } from 'react';
import { auth } from '../../config/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

const SignIn = () => {
  const navigate = useNavigate()
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignIn = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      console.log('Signed in successfully');
      navigate('/')
    } catch (error) {
      console.error(error);
    }
  };

  return (
    // <div>
    //   <h2>Sign In</h2>
    //   <form onSubmit={handleSignIn}>
    //     <div>
    //       <label htmlFor="email">Email</label>
    //       <input
    //         type="email"
    //         value={email}
    //         onChange={(e) => setEmail(e.target.value)}
    //       />
    //     </div>

    //     <div>
    //       <label htmlFor="password">Password</label>
    //       <input
    //         type="password"
    //         value={password}
    //         onChange={(e) => setPassword(e.target.value)}
    //       />
    //     </div>

    //     <button type="submit">Sign In</button>
    //   </form>
    // </div>
    <div className='w-full h-screen bg-no-repeat bg-center bg-cover'
      style={{
        backgroundImage:`url('/bg.png')`
      }}
    >
        <div className='pt-32'>
        <div className='flex justify-between backdrop-blur-md border rounded-xl overflow-hidden shadow-white shadow-md p-10  mx-[20%] items-center'>
            <div className='max-w-md text-white'>
                <h2 className='text-7xl mb-2'>Welcome Back</h2>
                <p>
                    Lorem, ipsum dolor sit amet consectetur adipisicing elit. Excepturi, blanditiis quod, quia, vero totam porro expedita modi doloremque nulla unde dolorem magni. Atque!
                </p>
            </div>             
            <div className='border text-black p-4 rounded-md backdrop-blur-lg min-w-96'>
            <h2 className='text-center text-2xl text-sky-500 border-b mb-2 pb-2 font-bold'>Login your Account</h2>
            <form onSubmit={handleSignIn}>
                <div>
                <label className='text-sky-500' htmlFor='email'>Email</label><br />
                <input
                    className='rounded-md p-1 w-full '
                    type='email'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                </div>

                <div>
                <label  className='text-sky-500' htmlFor="password">Password</label>
                <input
                    className='rounded-md p-1 w-full '
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                </div>

                <div>
                </div>

                <button className='bg-sky-600 text-white hover:bg-sky-700 border px-4 rounded-md mt-3 p-2 hover:shadow-md  hover:shadow-white ' type='submit'>
                    Login
                </button>
            </form>
            <div className='border-t text-white mt-2 text-center'>
                Don't have an account? 
                <span className='text-sky-500 cursor-pointer' onClick={()=>{navigate('/sign-up')}}> Register</span>
            </div>
            </div>  
        </div>  
        </div>   
    </div>    
  );
};

export default SignIn;