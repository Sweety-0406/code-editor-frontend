import React, { useEffect, useLayoutEffect, useState } from 'react'
import rough from 'roughjs';
import { MdOutlineCancel } from "react-icons/md";
import { motion } from 'framer-motion';

const roughGenerator = rough.generator()

const Board=({
  isOpen,
  setIsOpen,
  canvasRef,
  contextRef,
  elements,
  setElements,
  tool,
  socket,
  setSocket,
  groupId,
  userId,
  hostId
})=> {
  const[isDrawing, setIsDrawing] = useState(false);
  const[imageUrl, setImageUrl] = useState(null)
  const [strokeWidth, setStrokeWidth] = useState('4')
  const [backgroundColor,setBackgroundColor] = useState('black')
  const [color, setColor] = useState('white')
  const [fillStyle, setFillStyle] = useState('hachure')


  if(isOpen){
    console.log("open")
  }
 
  useEffect(()=>{
    socket.on("boardData",(data)=>{
      console.log(data.canvasImage)
      setImageUrl(data.canvasImage);
    })
  },[])

  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      canvas.height = window.innerHeight * 2; 
      canvas.width = window.innerWidth * 2;
      const context = canvas.getContext("2d");
      contextRef.current = context;
    }
  }, []);

  useLayoutEffect(()=>{
    const roughCanvas = rough.canvas(canvasRef.current);
    if(elements.length >0){
      contextRef.current.clearRect(0,0, canvasRef.current.width, canvasRef.current.height)
    }
    if(elements.length > 0){
      contextRef.current.clearRect(
        0,
        0,
        canvasRef.current.width,
        canvasRef.current.height
      )
    }
    elements.forEach(element => {
      if(element.type == 'pencil'){
        roughCanvas.linearPath(
          element.path,
          { 
            roughness: 0, 
            stroke: element.stroke,
            strokeWidth:element.strokeWidth  
          }
        ) 
      }
      else if(element.type == 'line'){
        roughCanvas.draw(
          roughGenerator.line(
            element.offsetX,
            element.offsetY,
            element.width,
            element.height,
            {
              roughness: 0, 
              stroke:element.stroke,
              strokeWidth:element.strokeWidth
            }
          )
        )
      }
      else if(element.type == 'circle'){
        roughCanvas.draw(
          roughGenerator.circle(
            element.offsetX,
            element.offsetY,
            Math.abs(element.width*2),
            // element.width, //give a flikering issue
            // element.height,
            {
              roughness: 0, 
              stroke:element.stroke,
              strokeWidth:element.strokeWidth ,
              fill:element.fill,
              fillStyle:element.fillStyle,
              // fillWeight:3,
            }
          )
        )
      }
      else if(element.type == 'ellipse'){
        roughCanvas.draw(
          roughGenerator.ellipse(
            element.offsetX,
            element.offsetY,
            element.width,
            element.height,
            {
              roughness: 0, 
              stroke:element.stroke,
              strokeWidth:element.strokeWidth,
              fill:element.fill,
              fillStyle:element.fillStyle
            }
          )
        )
      }
      else if(element.type == 'rectangle'){
        roughCanvas.draw(
          roughGenerator.rectangle(
            element.offsetX,
            element.offsetY,
            element.width,
            element.height,
            {
              roughness: 0, 
              stroke:element.stroke,
              strokeWidth:element.strokeWidth ,
              fill:element.fill,
              fillStyle:element.fillStyle
            }
            // { roughness: 0, fill: {color} }
          )
        )
      }
    });
    const canvasImage = canvasRef.current.toDataURL();
    socket.emit("board",canvasImage, groupId, userId)

  },[elements])

  const handleMouseDown = (e)=>{
    const{offsetX, offsetY} = e.nativeEvent
    console.log(offsetX, offsetY)

    if(tool == 'pencil'){
      setElements((prevElements)=>[
        ...prevElements,
        {
          type:"pencil",
          offsetX,
          offsetY,
          path:[[offsetX, offsetY]], 
          stroke:color,
          strokeWidth:strokeWidth,
        }
      ])
    }else if(tool == 'line'){
      setElements((prevElements)=>[
        ...prevElements,
        {
          type:"line",
          offsetX,
          offsetY,
          width: offsetX,
          height: offsetY,
          stroke:color,
          strokeWidth:strokeWidth,
        }
      ])
    }else if(tool == 'circle'){
      setElements((prevElements)=>[
        ...prevElements,
        {
          type:"circle",
          offsetX,
          offsetY,
          width: 0,
          height: 0,
          stroke:color,
          strokeWidth:strokeWidth,
          fill:backgroundColor,
          fillStyle:fillStyle
        }
      ])
    }else if(tool == 'ellipse'){
      setElements((prevElements)=>[
        ...prevElements,
        {
          type:"ellipse",
          offsetX,
          offsetY,
          width: 0,
          height: 0,
          stroke:color,
          strokeWidth:strokeWidth,
          fill:backgroundColor,
          fillStyle:fillStyle
        }
      ])
    }else if(tool == 'rectangle'){
      setElements((prevElements)=>[
        ...prevElements,
        {
          type:"rectangle",
          offsetX,
          offsetY,
          width: 0,
          height: 0,
          stroke:color,
          strokeWidth:strokeWidth,
          fill:backgroundColor,
          fillStyle:fillStyle
        }
      ])
    }

    setIsDrawing(true);
  }
  const handleMouseUp = (e)=>{
    setIsDrawing(false);
  }
  const handleMouseMove= (e)=>{
    const{offsetX, offsetY} = e.nativeEvent
    if(isDrawing){
      if(tool == 'pencil'){
        const {path} = elements[elements.length-1]
        const newPath = [...path, [offsetX, offsetY]]
        setElements((prevElements)=>
          prevElements.map((element, index)=>{
            if(index == elements.length-1){
              return {
                ...element,
                path:newPath
              }
            }else{
              return element;
            }
          })
        )
      }else if(tool == 'line'){
        setElements((prevElements)=>
          prevElements.map((element, index)=>{
            if(index == elements.length-1){
              return {
                ...element,
                width:offsetX,
                height:offsetY
              }
            }else{
              return element;
            }
          })
        )  
      }else if(tool == 'circle'){
        setElements((prevElements)=>
          prevElements.map((element, index)=>{
            if(index == elements.length-1){
              return {
                ...element,
                width:offsetX - element.offsetX,
                height:offsetY - element.offsetY
              }
            }else{
              return element;
            }
          })
        )  
      }else if(tool == 'ellipse'){
        setElements((prevElements)=>
          prevElements.map((element, index)=>{
            if(index == elements.length-1){
              return {
                ...element,
                width:offsetX - element.offsetX,
                height:offsetY - element.offsetY
              }
            }else{
              return element;
            }
          })
        )  
      }else if(tool == 'rectangle'){
        setElements((prevElements)=>
          prevElements.map((element, index)=>{
            if(index == elements.length-1){
              return {
                ...element,
                // width:offsetX,
                // height:offsetY
                width:offsetX - element.offsetX,
                height:offsetY - element.offsetY
              }
            }else{
              return element;
            }
          })
        )  
      }

    }
  }

  if(userId == hostId){
    return (
      <div className='relative'>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0,x:10 }} // Starts off-screen to the left
          animate={{ opacity: 1, x: 0 }} // Slides to its original position
          transition={{ duration: 0.6 }}
          className='text-white right-3 rounded-lg bg-zinc-900 p-1 mt-10 z-10   absolute  '
        >
        <div className='  '>
          <div className='mx-2'>
            <div className='relative'>
              <MdOutlineCancel onClick={()=>setIsOpen(false)} className='absolute size-5 right-2 cursor-pointer'/>
            </div>
            <div className='pt-8 border-b border-gray-700 pb-2 mb-2'>
                <label className='text-xs ' htmlFor="">Stroke-Color</label>
                <input 
                  type="color"
                  id='color'
                  value={color} 
                  className='rounded-sm ml-2  cursor-pointer'
                  onChange={(e)=> setColor(e.target.value)}
                />
            </div>
            <div className=' border-b border-gray-700 pb-2 mb-2'>
                <label className='text-xs ' htmlFor="">Background-Color</label>
                <input 
                  type="color"
                  id='backgroundColor'
                  value={backgroundColor} 
                  className='rounded-sm ml-2  cursor-pointer'
                  onChange={(e)=> setBackgroundColor(e.target.value)}
                />
            </div>
            <div className=' border-b border-gray-700 pb-2 mb-2'>
              <label className='text-xs ' htmlFor="">Select Fill</label>
              <select  onClick={(e)=>setFillStyle(e.target.value)} class="bg-zinc-800 p-2 ml-2 rounded">
                <option value="hachure">hachure </option>
                <option value="solid">solid </option>
                <option value="zigzag">zigzag </option>
                <option value="cross-hatch">cross-hatch </option>
                <option value="dashed">dashed </option>
                <option value=" zigzag-line"> zigzag-line </option>
              </select>
            </div>
            <div className=' border-b border-gray-700 pb-2 mb-2'>
              <label className='text-xs ' htmlFor="">Select Stroke Width</label>
              <select  onClick={(e)=>setStrokeWidth(e.target.value)} class="bg-zinc-800 p-2 ml-2 rounded">
                <option value="2">Extra Thin </option>
                <option value="4">Thin </option>
                <option value="6">Bold </option>
                <option value="8">Extra Bold </option>
              </select>
            </div>
          </div>
        </div> 
      </motion.div>
      )}
      <div
        className=' h-[82vh] overflow-hidden w-full  '
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        >
        <canvas ref={canvasRef}/>  
      </div>
      </div>
    ) 

  }
  return (
    <>
    <div
      className='  h-[84vh] overflow-hidden '
      >
      <div style={{width:  window.innerWidth*2}} className=' h-full'>
        {!imageUrl ? (
          <div></div>
        ):
        (

        <img
          src={imageUrl}
          alt="Real time white board image shared by presenter " 
          style={{
            height:  window.innerHeight * 2,
            width:  window.innerWidth*2 ,  
          }}
        />
        )}
      </div> 
      <canvas ref={canvasRef}/> 
      {/* {isOpen && ( */}
        <div className='text-white border mt-32 z-10 bg-red-500'>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Accusantium, in. Magni, quia perspiciatis distinctio voluptatem aspernatur nihil reiciendis quasi a quibusdam sint dolorum dignissimos asperiores porro, iusto dicta quaerat sunt.
        </div>
      {/* // )} */}
    </div>
    </>
  ) 

}
export default Board 
