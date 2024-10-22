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
  const [strokeStyle, setStrokeStyle] = useState([5,0])
  const [fillGap, setFillGap] = useState(3)
  const[fontSize, setFontSize] = useState(15)
  const [fontFamily, setFontFamily] = useState("Arial");
  const fonts = ["Arial", "Times New Roman", "Georgia", "Courier New", "Verdana"];


  if(isOpen){
    console.log("open")
  }
  
  useEffect(()=>{
    socket.on("boardData",(data)=>{
      console.log(data.canvasImage)
      setImageUrl(data.canvasImage);
    })
  },[])  
  // useEffect(() => {
  //   const handleBoardData = (data) => {
  //     console.log(data.canvasImage);
  //     setImageUrl(data.canvasImage);
  //   };
  
  //   socket.on("boardData", handleBoardData);
  
  //   return () => {
  //     socket.off("boardData", handleBoardData); // Clean up
  //   };
  // }, [socket]);

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
    // if(elements.length >0){
    //   contextRef.current.clearRect(0,0, canvasRef.current.width, canvasRef.current.height)
    // }
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
            strokeWidth:element.strokeWidth,
            strokeLineDash:element.strokeLineDash,
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
              strokeWidth:element.strokeWidth,
              strokeLineDash:element.strokeLineDash,
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
              strokeLineDash:element.strokeLineDash,
              hachureGap: element.hachureGap,
              seed:23
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
              fillStyle:element.fillStyle,
              strokeLineDash:element.strokeLineDash,
              hachureGap: element.hachureGap
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
              fillStyle:element.fillStyle,
              strokeLineDash:element.strokeLineDash,
              hachureGap: element.hachureGap,
              // seed:seedValue
            }
            // { roughness: 0, fill: {color} }
          )
        )
      }
      else if(element.type === 'text'){//..............................................................................
        contextRef.current.font = `${element.fontSize}px ${element.fontFamily}`; // You can customize font here
        contextRef.current.fillStyle = element.stroke; // Use stroke as text color
        contextRef.current.fillText(element.text, element.offsetX, element.offsetY); 
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
          strokeLineDash:strokeStyle
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
          strokeLineDash:strokeStyle,
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
          fillStyle:fillStyle,
          strokeLineDash: strokeStyle,
          hachureGap:fillGap
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
          fillStyle:fillStyle,
          strokeLineDash: strokeStyle,
          hachureGap:fillGap
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
          fillStyle:fillStyle,
          strokeLineDash: strokeStyle,
          hachureGap:fillGap
        }
      ])
    }else if(tool == 'text'){
      const newText = window.prompt('Enter text:', '');
      if (newText) {
        setElements((prev) => [
          ...prev,
          {
            type: 'text',
            text: newText,
            offsetX,
            offsetY,
            stroke: color,
            fontSize: fontSize,
            fontFamily:fontFamily
          }
        ]);
      }
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
      }else if(tool == 'text'){
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
              <select  onClick={(e)=>setFillStyle(e.target.value)} className="bg-zinc-800 p-2 ml-2 rounded">
                <option value="hachure">hachure </option>
                <option value="solid">solid </option>
                <option value="zigzag">zigzag </option>
                <option value="cross-hatch">cross-hatch </option>
                <option value="dashed">dashed </option>
              </select>
            </div>
            <div className=' border-b border-gray-700 pb-2 mb-2'>
              <label className='text-xs ' htmlFor="">Select Stroke Width</label>
              <select  onClick={(e)=>setStrokeWidth(e.target.value)} className="bg-zinc-800 p-2 ml-2 rounded">
                <option value="2">Extra Thin </option>
                <option value="4">Thin </option>
                <option value="6">Bold </option>
                <option value="8">Extra Bold </option>
              </select>
            </div>
            <div className=' border-b border-gray-700 pb-2 mb-2'>
              <label className='text-xs ' htmlFor="">Select Stroke Style</label>
              <select  onClick={(e) => setStrokeStyle(e.target.value.split(',').map(Number))} className="bg-zinc-800 p-2 ml-2 rounded">
                <option value="5,0">Normal</option>
                <option value="5,5">Dashed </option>
              </select>
            </div>
            <div className='flex py-3 border-b border-gray-700 mb-2'>
              <label className='text-xs ' htmlFor="">Select Fill Gap</label>
              <input onClick={(e)=>setFillGap(e.target.value)} type="range" min={3} max={20} step={1} className="bg-zinc-800  ml-2 rounded"/>
            </div>
            <div className='flex py-3 border-b border-gray-700 mb-2'>
              <label className='text-xs ' htmlFor="">Select Font Size</label>
              <input onClick={(e)=>setFontSize(e.target.value)} type="range" min={10} max={100} step={1} className="bg-zinc-800  ml-2 rounded"/>
            </div>
            <div className=' border-b border-gray-700 pb-2 mb-2'>
              <label className='text-xs' htmlFor="">Select Font Family</label>
              <select onClick={(e)=>setFontFamily(e.target.value)} type=""  step={1} className="bg-zinc-800 p-2 ml-2 rounded">
                {fonts.map((font, ind)=>(
                  <option index={ind} value={font}>
                    {font}
                  </option>
                ))}
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
