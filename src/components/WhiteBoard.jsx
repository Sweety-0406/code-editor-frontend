 
import React,{useEffect, useRef, useState} from 'react'
import { motion } from 'framer-motion';
import Board from './Board';
import { HiPencil } from "react-icons/hi2";
import { PiLineVertical } from "react-icons/pi";
import { BiRectangle } from "react-icons/bi";
import { FaRegCircle } from "react-icons/fa";
import { TbOvalVertical } from "react-icons/tb";
import { ImUndo2 } from "react-icons/im";
import { ImRedo2 } from "react-icons/im";
import { FcDeleteDatabase } from "react-icons/fc";
import { RiDeleteBin6Fill } from "react-icons/ri";


const WhiteBoard = ({
    socket,
    setSocket,
    groupId,
    userId,
    hostId
})=> {
    const canvasRef = useRef(null);
    const contextRef = useRef(null)
    const[tool, setTool] = useState("pencil");
    const[color, setColor] = useState("black");
    const[elements, setElements] = useState([])
    const[history, setHistory] = useState([])
    const[isRedoDisabled, setIsRedoDisabled] = useState(true)
    const[isUndoDisabled, setIsUndoDisabled] = useState(true)

    // useEffect(()=>{
    //     if(history.length >= 1){
    //         setIsRedoDisabled(false)
    //     }else{
    //         setIsRedoDisabled(true)
    //     }
    // },[history])
    useEffect(()=>{
        if(history.length == 0){
            setIsRedoDisabled(true)
        }else{
            setIsRedoDisabled(false)
        }
    },[history])

    useEffect(()=>{
        if(elements.length == 0){
            setIsUndoDisabled(true);
        }else{
            setIsUndoDisabled(false)
        }
    },[elements])

    const handleClearBoard = ()=>{
        const canvas = canvasRef.current;
        const context = canvas.getContext("2d");
        context.fillRect = 'white'
        contextRef.current.clearRect(
            0,
            0,
            canvasRef.current.width,
            canvasRef.current.height
        )
        setElements([])
        setHistory([])
    }

    const undoHandler = ()=>{
        setHistory((prevElements)=>[
            ...prevElements,
            elements[elements.length-1]
        ])

        setElements(prevElements => 
            prevElements.slice(0,prevElements.length-1)
        )
    }

    const redoHandler = ()=>{
        setElements((prevElements)=>[
            ...prevElements,
            history[history.length-1]
        ])

        setHistory(prevElements => 
            prevElements.slice(0,prevElements.length-1)
        ) 
    }
  return (
    <motion.div 
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }} 
        className='mt-1  bg-white text-black border-2 pt-2 border-yellow-400 rounded-md'
    >
      {userId == hostId ?
      (
        <div className='flex gap-2 justify-center'>
            <div className='flex gap-3 justify-center shadow-lg px-4 py-1 rounded-2xl'>
                
                <div className='flex'>
                    <label htmlFor="pencil" className={`cursor-pointer hover:bg-blue-100 rounded-lg px-[6px] ${tool == "pencil"? "bg-blue-200 rounded-lg px-[6px] ":"bg-transparent"} `}>
                        <input
                            type="radio"
                            name="tool"
                            id="pencil"
                            value="pencil"
                            className='hidden'  
                            onChange={(e) => setTool(e.target.value)}
                        />
                        <HiPencil className='mt-2' /> 
                    </label>
                </div>

                <div className='flex '>
                    <label htmlFor="line" className={`cursor-pointer hover:bg-blue-100 rounded-lg px-[6px] ${tool == "line"? "bg-blue-200 rounded-lg px-[6px] ":"bg-transparent"} `} >
                        <input
                            type="radio"
                            name="tool"
                            id="line"
                            value="line"
                            className='hidden '  
                            onChange={(e) => setTool(e.target.value)}
                        />
                        <PiLineVertical className="mt-2" /> 
                    </label>
                </div>

                <div className='flex'>
                    <label htmlFor="circle" className={`cursor-pointer hover:bg-blue-100 rounded-lg px-[6px] ${tool == "circle"? "bg-blue-200 rounded-lg px-[6px] ":"bg-transparent"} `}>
                        <input
                            type="radio"
                            name="tool"
                            id="circle"
                            value="circle"
                            className='hidden'  
                            onChange={(e) => setTool(e.target.value)}
                        />
                        <FaRegCircle className='mt-2' /> 
                    </label>
                </div>

                <div className='flex'>
                    <label htmlFor="ellipse" className={`cursor-pointer hover:bg-blue-100 rounded-lg px-[6px] ${tool == "ellipse"? "bg-blue-200 rounded-lg px-[6px] ":"bg-transparent"} `}>
                        <input
                            type="radio"
                            name="tool"
                            id="ellipse"
                            value="ellipse"
                            className='hidden' 
                            onChange={(e) => setTool(e.target.value)}
                        />
                        <TbOvalVertical className='mt-2' /> 
                    </label>
                </div>

                <div className='flex'>
                    <label htmlFor="rectangle" className={`cursor-pointer hover:bg-blue-100 rounded-lg px-[6px] ${tool == "rectangle"? "bg-blue-200 rounded-lg px-[6px] ":"bg-transparent"} `}>
                        <input
                            type="radio"
                            name="tool"
                            id="rectangle"
                            value="rectangle"
                            className='hidden'  
                            onChange={(e) => setTool(e.target.value)}
                        />
                        <BiRectangle className='mt-2' /> 
                    </label>
                </div>

                {/* </div> */}
                <div className='mt-1'>
                    {/* <label htmlFor="color">Select color</label> */}
                    <input 
                        type="color"
                        id='color'
                        value={color} 
                        className='rounded-sm ms-2 cursor-pointer'
                        onChange={(e)=> setColor(e.target.value)}
                    />
                </div>
                
                <div
                    disabled={elements.length == 0}
                    onClick={elements.length === 0 ? null : undoHandler} 
                    className={` 
                        ${isUndoDisabled? "text-gray-500":"bg-white"} 
                        ${isUndoDisabled? "cursor-not-allowed":"cursor-pointer"} 
                        hover:bg-gray-300 
                        py-1 
                        px-2 
                        rounded-md
                        mt-1
                    `}
                >
                    <ImUndo2 disabled={elements.length == 0} />
                </div>
                <div
                    disabled={history.length <1 }
                    onClick={history.length <1 ? null : redoHandler} 
                    className={` 
                        ${isRedoDisabled? "text-gray-500":"bg-white"} 
                        ${isRedoDisabled? "cursor-not-allowed":"cursor-pointer"} 
                        hover:bg-gray-300 
                        py-1 
                        px-2 
                        rounded-md
                        mt-1
                        pt-1
                    `}
                >
                    <ImRedo2 disabled={history.length <1 }/>
                </div>
                
                <div onClick={handleClearBoard} className=' py-1 px-2 rounded-md cursor-pointer hover:bg-red-200'>
                    <FcDeleteDatabase className='w-6 h-6' />
                </div>
            </div>

        </div>):
      (
        <div className=' text-xl ml-1 '>Real time white board image shared by presenter</div>
      )
      }
      <div className='mt-2'>
        <Board 
            canvasRef={canvasRef} 
            contextRef={contextRef} 
            elements={elements} 
            setElements={setElements} 
            tool={tool}
            color={color}
            socket={socket}
            setSocket={setSocket}
            groupId={groupId}
            userId={userId}
            hostId={hostId}
        />
      </div>
    
    </motion.div>
  )
}

export default WhiteBoard
