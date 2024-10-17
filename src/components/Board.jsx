import React, { useEffect, useLayoutEffect, useState } from 'react'
import rough from 'roughjs';

const roughGenerator = rough.generator()

const Board=({
  canvasRef,
  contextRef,
  elements,
  setElements,
  tool,
  color,
  socket,
  setSocket,
  groupId,
  userId,
  hostId
})=> {
  const[isDrawing, setIsDrawing] = useState(false);
  const[imageUrl, setImageUrl] = useState(null)

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
        roughCanvas.linearPath(element.path,{ roughness: 0, stroke: element.stroke }) 
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
              stroke:element.stroke
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
              stroke:element.stroke
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
              stroke:element.stroke
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
              stroke:element.stroke
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
      <>
      <div
        className=' h-[82vh] overflow-hidden w-full  '
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        >
        <canvas ref={canvasRef}/>  
      </div>
      </>
    ) 

  }
  return (
    <>
    <div
      className='  h-[84vh] overflow-hidden  bg-white'
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
    </div>
    </>
  ) 

}
export default Board 
