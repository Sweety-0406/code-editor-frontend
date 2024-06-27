
import MessageField from './MessageField';
import CodeField from './CodeField';
import { useLocation } from 'react-router-dom';



function MainPage() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search)
  const groupId = searchParams.get('id');
  const username = searchParams.get('username');
  const userId = searchParams.get('userId');

  return (
    <div className='grid grid-cols-10 h-screen'>
      <div className='col-span-5 bg-slate-700'>
       <MessageField groupId={groupId} username={username} userId={userId} />
      </div>
      <div className='col-span-5 border-l bg-slate-700'>
       <CodeField groupId={groupId} />
      </div>
    </div>
  );
}

export default MainPage;
