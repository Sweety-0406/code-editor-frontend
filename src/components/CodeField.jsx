
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
        <div className=" mx-1 mt-0 text-white">
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