// import CodeEditor from "./CodeEditor"
// import PropTypes from 'prop-types'
// import { useState, useEffect } from "react";
// import { motion } from "framer-motion"
// import WhiteBoard from "./WhiteBoard";
// import { useSearchParams } from "react-router-dom";

// const CodeField = (props)=>{
//     const [searchParams] = useSearchParams()
//     const choice = searchParams.get('choice')
//     const [showComponent, setShowComponent] = useState(false);
//     console.log(choice)

//     useEffect(() => {
//         const timer = setTimeout(() => {
//             setShowComponent(true); 
//         }, 1);

//         return () => clearTimeout(timer);
//     }, []);
    
    
//     return(
//         <div className="m-3 text-white">
//             {/* <div className="mb-1">
//                 <div className="grid grid-cols-2 gap-2">
//                     <div className="w-full hover:shadow-lg hover:shadow-black  bg-gray-300 cursor-pointer rounded-lg text-center" onClick={()=> setTab("code")}>
//                         <motion.div 
//                             initial={{ opacity: 0, scale: 0.5 }}
//                             animate={{ opacity: 1, scale: 1 }}
//                             transition={{ duration: 0.5 }} 
//                             className={`
//                                 m-1
//                                 p-[1px]
//                                 rounded-lg
                                
//                                 ${tab == "code"? 'bg-black':'bg-gray-700'}
//                             `}>
//                             code
//                         </motion.div>
//                     </div>
//                     <div className="w-full hover:shadow-lg hover:shadow-black  bg-gray-300 cursor-pointer rounded-lg text-center" onClick={()=> setTab("board")}>
//                         <motion.div
//                             initial={{ opacity: 0, scale: 0.5 }}
//                             animate={{ opacity: 1, scale: 1 }}
//                             transition={{ duration: 0.5 }} 
//                             className={`
//                                 m-1
//                                 p-[1px]
//                                 rounded-lg
//                                 ${tab == "board"? 'bg-black':'bg-gray-700'}
//                             `}>
//                             board
//                         </motion.div>
//                     </div>
//                 </div>
//             </div>  */}
//             {/* <div>
//                 <hr />
//                 <hr />
//                 <hr />
//                 <hr />
//             </div> */}
//             <div className="w-[100%]">
//                 {/* {props.choice != "code-editor" ? (
//                     // <CodeEditor groupId={props.groupId} />
//                     showComponent && (<WhiteBoard hostId={props.hostId} userId={props.userId} socket={props.socket} setSocket={props.setSocket} groupId={props.groupId} />)
//                 ) : (
//                     // <WhiteBoard hostId={props.hostId} userId={props.userId} socket={props.socket} setSocket={props.setSocket} groupId={props.groupId} />
//                     <CodeEditor groupId={props.groupId} />
//                 )} */}
//                 {props.choice == "code-editor" && 
//                     <CodeEditor groupId={props.groupId} />
//                 }
//                 {props.choice == "board" && 
//                     showComponent && (<WhiteBoard hostId={props.hostId} userId={props.userId} socket={props.socket} setSocket={props.setSocket} groupId={props.groupId} />)
//                 }

//             </div>
//         </div>
//     )
// }

// CodeField.propTypes = {
//     groupId: PropTypes.string.isRequired,
// };
 
// export default CodeField
import CodeEditor from "./CodeEditor"
import PropTypes from 'prop-types'
import { useState, useEffect } from "react";
import { motion } from "framer-motion"
import WhiteBoard from "./WhiteBoard";
import { useSearchParams } from "react-router-dom";

const CodeField = (props)=>{
    const [searchParams] = useSearchParams()
    const choice = searchParams.get('choice')
    const [showComponent, setShowComponent] = useState(false);
    console.log(choice)

    useEffect(() => {
        const timer = setTimeout(() => {
            setShowComponent(true); 
        }, 1);

        return () => clearTimeout(timer);
    }, []);
    
    
    return(
        <div className="m-3 text-white">
            <div className="w-[100%]">
                {props.choice == "code-editor" && 
                    <CodeEditor groupId={props.groupId} />
                }
                {props.choice == "board" && 
                    showComponent && (<WhiteBoard hostId={props.hostId} userId={props.userId} socket={props.socket} setSocket={props.setSocket} groupId={props.groupId} />)
                }

            </div>
        </div>
    )
}

CodeField.propTypes = {
    groupId: PropTypes.string.isRequired,
};
 
export default CodeField