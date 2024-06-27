import CodeEditor from "./CodeEditor"
import PropTypes from 'prop-types'

const CodeField = (props)=>{
    return(
        <div className="m-3 text-white">
            <div className='text-xl  font-serif font-bold pb-2'>
                Code Area
            </div>  
            <div>
                <hr />
                <hr />
                <hr />
                <hr />
            </div>
            <div className="w-[100%]">
             <CodeEditor groupId={props.groupId} />
            </div>
        </div>
    )
}

CodeField.propTypes = {
    groupId: PropTypes.string.isRequired,
};
 
export default CodeField