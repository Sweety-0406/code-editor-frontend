// import React, { useEffect, useLayoutEffect, useState } from 'react'
// import rough from 'roughjs';
// import { MdOutlineCancel } from "react-icons/md";
// import { motion } from 'framer-motion';

// const roughGenerator = rough.generator()

// const Board=({
//   isOpen,
//   setIsOpen,
//   canvasRef,
//   contextRef,
//   elements,
//   setElements,
//   tool,
//   socket,
//   setSocket,
//   groupId,
//   userId,
//   hostId
// })=> {
//   const fillOptions = ['hachure', 'solid', 'zigzag', 'cross-hatch']
//   const strokeOptions = ['extra-thin', 'thin', 'bold', 'extra-bold']
//   const fonts = ["Serif", "Sans-serif", "Monospace", "Cursive", "Fantasy"];
//   const strokeColor = ["#FFFFFF", "#1e1e1e", "#e03131", "#2f9e44", "#1971c2", "#f08c00"];
//   const bgColor = ["#ffffff00","#FFFFFF",, "#ffc9cf", "#b2f2bb", "#a5d8ff", "#ffec99"];
//   // const bgColor = ["#ffffff00","#FFFFFF",, "#e03131", "#2f9e44", "#1971c2", "#f08c00"];
//   const[isDrawing, setIsDrawing] = useState(false);
//   const[imageUrl, setImageUrl] = useState(null)
//   const [strokeWidth, setStrokeWidth] = useState('4')
//   const [backgroundColor,setBackgroundColor] = useState('transparent')
//   const [color, setColor] = useState('white')
//   const [fillStyle, setFillStyle] = useState('hachure')
//   const [strokeStyle, setStrokeStyle] = useState([5,0])
//   const [fillGap, setFillGap] = useState(3)
//   const[fontSize, setFontSize] = useState(15)
//   const [fontFamily, setFontFamily] = useState("Serif");
//   const [selectedElement, setSelectedElement] = useState(null)
//   const[textInput, setTextInput] = useState('')
//   const[inputPosition, setInputPositioin] = useState(null);


  
//   useEffect(()=>{
//     socket.on("boardData",(data)=>{
//       // console.log(data.canvasImage)
//       setImageUrl(data.canvasImage);
//     })
//   },[socket])  

//   useEffect(() => {
//     if (canvasRef.current) {
//       const canvas = canvasRef. current;
//       canvas.height = window.innerHeight * 2; 
//       canvas.width = window.innerWidth * 2;
//       const context = canvas.getContext("2d");
//       contextRef.current = context;
//     }
//   }, []);

//   const textClickHandler = (e)=>{
//     if(tool=='text'){
//       // const offsetX = e.clientX;
//       // const offsetY = e.clientY;
//       const canvas = e.currentTarget; // Assuming this is the canvas element
//       const rect = canvas.getBoundingClientRect(); // Get canvas position
//       const offsetX = e.clientX - rect.left; // Adjust X position
//       const offsetY = e.clientY - rect.top; 
//       setInputPositioin({offsetX, offsetY})
//     }
//   }

//   const textInputHandler = (e)=>{
//     setTextInput(e.target.value)
//   }

//   const handleResize = (event) => {
//     // Reset height to 'auto' so it can shrink if needed
//     event.target.style.height = "auto";
//     // Set height based on scroll height to adjust to content
//     event.target.style.height = `${event.target.scrollHeight}px`;
//   };

//   useLayoutEffect(()=>{
//     const roughCanvas = rough.canvas(canvasRef.current);
//     // if(elements.length >0){
//     //   contextRef.current.clearRect(0,0, canvasRef.current.width, canvasRef.current.height)
//     // }
//     if(!elements || elements.length > 0){
//       contextRef.current.clearRect(
//         0,
//         0,
//         canvasRef.current.width,
//         canvasRef.current.height
//       )
//     }
//     elements.forEach(element => {
//       if(element.type == 'pencil'){
//         roughCanvas.linearPath(
//           element.path, 
//           { 
//             roughness: 0, 
//             stroke: element.stroke,
//             strokeWidth:element.strokeWidth,
//             strokeLineDash:element.strokeLineDash,
//           } 
//         )  
//       }
//       else if(element.type == 'line'){
//         roughCanvas.draw(
//           roughGenerator.line(
//             element.offsetX,
//             element.offsetY,
//             element.width, 
//             element.height,
//             {
//               roughness: 0, 
//               stroke:element.stroke,
//               strokeWidth:element.strokeWidth,
//               strokeLineDash:element.strokeLineDash,
//             }
//           )
//         )
//       }
//       else if(element.type == 'circle'){
//         roughCanvas.draw(
//           roughGenerator.circle(
//             element.offsetX,
//             element.offsetY,
//             Math.abs(element.width*2),
//             // element.width, //give a flikering issue
//             // element.height,
//             {
//               roughness: 0, 
//               stroke:element.stroke,
//               strokeWidth:element.strokeWidth ,
//               fill:element.fill,
//               fillStyle:element.fillStyle,
//               strokeLineDash:element.strokeLineDash,
//               hachureGap: element.hachureGap,
//               seed:23
//               // fillWeight:3, 
//             }  
//           )
//         )
//       }
//       else if(element.type == 'ellipse'){
//         roughCanvas.draw(
//           roughGenerator.ellipse(
//             element.offsetX,
//             element.offsetY,
//             element.width,
//             element.height,
//             {
//               roughness: 0, 
//               stroke:element.stroke,
//               strokeWidth:element.strokeWidth,
//               fill:element.fill,
//               fillStyle:element.fillStyle,
//               strokeLineDash:element.strokeLineDash,
//               hachureGap: element.hachureGap
//             }
//           )
//         )
//       }
//       else if(element.type == 'rectangle'){
//         roughCanvas.draw(
//           roughGenerator.rectangle(
//             element.offsetX,
//             element.offsetY,
//             element.width,
//             element.height,
//             {
//               roughness: 0, 
//               stroke:element.stroke,
//               strokeWidth:element.strokeWidth ,
//               fill:element.fill,
//               fillStyle:element.fillStyle,
//               strokeLineDash:element.strokeLineDash,
//               hachureGap: element.hachureGap,
//               // seed:seedValue
//             }
//             // { roughness: 0, fill: {color} }
//           )
//         )
//       }
//       else if(element.type === 'text'){//..............................................................................
//         contextRef.current.font = `${element.fontSize}px ${element.fontFamily}`; // You can customize font here
//         contextRef.current.fillStyle = element.stroke; // Use stroke as text color
//         // contextRef.current.fillText(element.text, element.offsetX, element.offsetY); 
//         const lines = element.text.split('\n')
//         const lineHeight = element.fontSize * 1.2

//         lines.forEach((line,ind)=>{
//           contextRef.current.fillText(
//             line,
//             element.offsetX,
//             element.offsetY + ind * lineHeight
//           )
//         })
//       }
//     }); 
//     const canvasImage = canvasRef.current.toDataURL();
//     socket.emit("board",canvasImage, groupId, userId)

//   },[elements]) 

//   const handleMouseDown = (e)=>{
//     const{offsetX, offsetY} = e.nativeEvent 

//     const clickedElement = elements.findIndex((ele)=>{
//       if(ele.type == 'pencil'){ 
//         const minX = Math.min(...ele.path.map(point => point[0]));
//         const maxX = Math.max(...ele.path.map(point => point[0]));
//         const minY = Math.min(...ele.path.map(point => point[1]));
//         const maxY = Math.max(...ele.path.map(point => point[1]));

//         // Check if click is within the bounding box
//         return offsetX >= minX && offsetX <= maxX && offsetY >= minY && offsetY <= maxY;
//       }
//       else if(ele.type == 'line'){ 
//         return(
//           offsetX >=ele.offsetX &&
//           offsetX <=ele.offsetX + ele.width &&
//           offsetY >=ele.offsetY &&
//           offsetY <=ele.offsetY + ele.height
//         )
//       }
//       if(ele.type == 'circle' || ele.type === 'ellipse'){
//         const dist = Math.sqrt(
//           Math.pow(offsetX - ele.offsetX, 2) + Math.pow(offsetY - ele.offsetY, 2)
//         );
//         return dist <= ele.width / 2; 

 
//         // return(
//         //   offsetX >=ele.offsetX &&
//         //   offsetX <=ele.offsetX + ele.width &&
//         //   offsetY >=ele.offsetY - ele.height &&
//         //   offsetY <=ele.offsetY
//         // ) 


//         // const radiusX = Math.abs(ele.width) / 2;
//         // const radiusY = Math.abs(ele.height) / 2;
//         // const centerX = ele.offsetX + radiusX;
//         // const centerY = ele.offsetY + radiusY;
//         // return (
//         //   Math.pow(offsetX - centerX, 2) / Math.pow(radiusX, 2) +
//         //   Math.pow(offsetY - centerY, 2) / Math.pow(radiusY, 2) <=
//         //   1
//         // );
//       }else if(ele.type == 'rectangle'){ 
//         return(
//           offsetX >=ele.offsetX &&
//           offsetX <=ele.offsetX + ele.width &&
//           offsetY >=ele.offsetY &&
//           offsetY <=ele.offsetY + ele.height
//         )
//       }else if(ele.type == 'text'){
//         const textWidth = contextRef.current.measureText(ele.text).width;
//         const textHeight = ele.fontSize;
//         return( 
//           offsetX >=ele.offsetX &&
//           offsetX <=ele.offsetX + textWidth &&
//           offsetY >=ele.offsetY - textHeight &&
//           offsetY <=ele.offsetY
//         )
//       }
//       return false;
//     })
 
//     if(clickedElement !== -1){
//       setSelectedElement(clickedElement);
//       setIsDrawing(true);
//     }
//     else {
//       if(tool == 'pencil'){
//         setElements((prevElements)=>[
//           ...prevElements,
//           {
//             type:"pencil",
//             offsetX, 
//             offsetY,
//             path:[[offsetX, offsetY]], 
//             stroke:color,
//             strokeWidth:strokeWidth,
//             strokeLineDash:strokeStyle,
//             seed:20
//           }
//         ])
//       }else if(tool == 'line'){
//         setElements((prevElements)=>[
//           ...prevElements,
//           {
//             type:"line",
//             offsetX,
//             offsetY,
//             width: offsetX,
//             height: offsetY,
//             stroke:color,
//             strokeWidth:strokeWidth,
//             strokeLineDash:strokeStyle,
//           }
//         ])
//       }else if(tool == 'circle'){
//         setElements((prevElements)=>[
//           ...prevElements,
//           {
//             type:"circle",
//             offsetX,
//             offsetY,
//             width: 0,
//             height: 0,
//             stroke:color,
//             strokeWidth:strokeWidth,
//             fill:backgroundColor,
//             fillStyle:fillStyle,
//             strokeLineDash: strokeStyle,
//             hachureGap:fillGap
//           }
//         ])
//       }else if(tool == 'ellipse'){
//         setElements((prevElements)=>[
//           ...prevElements,
//           {
//             type:"ellipse",
//             offsetX,
//             offsetY,
//             width: 0,
//             height: 0,
//             stroke:color,
//             strokeWidth:strokeWidth,
//             fill:backgroundColor,
//             fillStyle:fillStyle,
//             strokeLineDash: strokeStyle,
//             hachureGap:fillGap
//           }
//         ])
//       }else if(tool == 'rectangle'){
//         setElements((prevElements)=>[
//           ...prevElements,
//           {
//             type:"rectangle",
//             offsetX,
//             offsetY,
//             width: 0,
//             height: 0,
//             stroke:color,
//             strokeWidth:strokeWidth,
//             fill:backgroundColor,
//             fillStyle:fillStyle,
//             strokeLineDash: strokeStyle,
//             hachureGap:fillGap
//           }
//         ])
//       }else if(tool == 'text'){
//         // const newText = window.prompt('Enter text:', '');
//         // if (newText) {
//           setElements((prev) => [
//             ...prev,
//             {
//               type: 'text',
//               text: textInput,
//               offsetX,
//               offsetY,
//               stroke: color,
//               fontSize: fontSize,
//               fontFamily:fontFamily,

//             }
//           ]);
//           setInputPositioin(null);
//           setTextInput('')
//         // }
//       } 
//     }


//     setIsDrawing(true);
//   } 


//   const handleMouseUp = (e)=>{
//     setIsDrawing(false);
//     setSelectedElement(null);
//   }


//   const handleMouseMove = (e) => {
//     const { offsetX, offsetY } = e.nativeEvent;
  
//     if (isDrawing ) {
//       // Update position of selected text element
//       if(selectedElement !== null){
//         setElements((prevElements) =>
//           prevElements.map((element, index) => {
//             if(index==selectedElement){
//               if(element.type === 'pencil'){
//                 const deltaX = offsetX - element.offsetX;
//                 const deltaY = offsetY - element.offsetY;

//                 const newPath = element.path.map(([x, y]) => [x + deltaX, y + deltaY]);
//                 return {
//                   ...element,
//                   path: newPath,
//                   offsetX,  
//                   offsetY,
//                   // style:{
//                   //   ...element.style,
//                   //   cursor:"pointer",
//                   //   border: '1px dashed black', 
//                   // } 
//                 }  
//               }
//               else if(element.type === 'line'){
//                 const deltaX = offsetX - element.offsetX; // Change in X
//                 const deltaY = offsetY - element.offsetY; // Change in Y
 
//                 return {
//                   ...element,
//                   offsetX, // Update new starting point X
//                   offsetY, // Update new starting point Y
//                   width: element.width + deltaX, // Adjust endpoint X
//                   height: element.height + deltaY, // Adjust endpoint Y
//                 };
//               }
//               else if(element.type === 'circle' || element.type === 'ellipse'){
//                 return {
//                   ...element,
//                   offsetX: offsetX, 
//                   offsetY: offsetY,
//                 } 
//               } 
//               else if (element.type === 'rectangle') {
//                 return {
//                   ...element,
//                   offsetX: offsetX, 
//                   offsetY: offsetY,
//                 }; 
//               }
//               else if (element.type === 'text') {
//                 return {
//                   ...element,
//                   offsetX: offsetX, 
//                   offsetY: offsetY, 
//                 };
//               }
//             }
//             return element;  
//           })
//         );
//       }else {
//         if(tool == 'pencil'){
//           const {path} = elements[elements.length-1]
//           const newPath = [...path, [offsetX, offsetY]]
//           setElements((prevElements)=>
//             prevElements.map((element, index)=>{
//               if(index == elements.length-1){
//                 return {
//                   ...element,
//                   path:newPath
//                 }
//               }else{
//                 return element;
//               }
//             })
//           )
//         }else if(tool == 'line'){
//           setElements((prevElements)=>
//             prevElements.map((element, index)=>{
//               if(index == elements.length-1){
//                 return {
//                   ...element,
//                   width:offsetX,
//                   height:offsetY
//                 }
//               }else{
//                 return element;
//               } 
//             })
//           )  
//         }else if(tool == 'circle'){
//           setElements((prevElements)=>
//             prevElements.map((element, index)=>{
//               if(index == elements.length-1){
//                 return {
//                   ...element, 
//                   width:offsetX - element.offsetX,
//                   height:offsetY - element.offsetY
//                 }
//                 // const radius = Math.sqrt(
//                 //   Math.pow(offsetX - element.offsetX, 2) + Math.pow(offsetY - element.offsetY, 2)
//                 // );
//                 // return {
//                 //   ...element,
//                 //   width: radius * 2, // Update diameter
//                 //   height: radius * 2,
//                 // };
//               }else{
//                 return element;
//               }
//             })
//           )  
//         }else if(tool == 'ellipse'){
//           setElements((prevElements)=>
//             prevElements.map((element, index)=>{
//               if(index == elements.length-1){
//                 return {
//                   ...element,
//                   width:offsetX - element.offsetX,
//                   height:offsetY - element.offsetY
//                 }
//               }else{
//                 return element;
//               }
//             })
//           )  
//         }else if(tool == 'rectangle'){
//           setElements((prevElements)=>
//             prevElements.map((element, index)=>{
//               if(index == elements.length-1){
//                 return {
//                   ...element,
//                   // width:offsetX,
//                   // height:offsetY
//                   width:offsetX - element.offsetX,
//                   height:offsetY - element.offsetY
//                 }
//               }else{
//                 return element;
//               }
//             })
//           )  
//         }else if(tool == 'text'){
//           setElements((prevElements)=>
//             prevElements.map((element, index)=>{
//               if(index == elements.length-1){
//                 return {
//                   ...element,
//                   width:offsetX,
//                   height:offsetY
//                 }
//               }else{
//                 return element;
//               }
//             })
//           )  
//         }
//       }
//     }
//   };

//   if(userId == hostId){ 
//     return (
//       <div className='relative ' onClick={textClickHandler}>
//         {isOpen && (
//           <motion.div
//             initial={{ opacity: 0,x:10 }} // Starts off-screen to the left
//             animate={{ opacity: 1, x: 0 }} // Slides to its original position
//             transition={{ duration: 0.6 }}
//             className='text-white right-3 rounded-lg bg-zinc-900 p-1 mt-10 z-10   absolute  '
//           >
//           <div> 
//             <div className='mx-2'>
//               <div className='relative'>
//                 <MdOutlineCancel onClick={()=>setIsOpen(false)} className='absolute hover:shadow-md hover:shadow-white rounded-full size-5 right-2 top-2 cursor-pointer'/>
//               </div>
//               <div className='pt-8 border-b border-gray-700 pb-2 mb-2'>
//                 <label className="text-xs" htmlFor="">
//                   Stroke  
//                 </label>
//                 <div className="flex space-x-2 mt-1">
//                   {strokeColor.map((option,ind) => (
//                     <div
//                     onClick={() => setColor(option)}
//                     className={`
//                       size-7
//                       rounded 
//                       cursor-pointer 
//                       flex justify-center items-center
//                       overflow-hidden
//                       ${color == option ? 'bg-indigo-300 opacity-60 ' : 'bg-zinc-700 opacity-70'}
//                     `}
//                     >
//                       <div
//                         key={option}
//                         className= {`rounded-sm size-5 `}
//                         style={{backgroundColor: option}}
//                       >
                        
//                       </div>
//                     </div> 
//                   ))}
//                 </div>
//               </div>

//               {tool != 'text' && (
//                 <div>
//                   <div className=' border-b border-gray-700 pb-2 mb-2'>
//                     <label className="text-xs" htmlFor="">
//                       Background  
//                     </label>
//                     <div className="flex space-x-2 mt-1">
//                       {bgColor.map((option,ind) => (
//                         <div
//                         onClick={() => setBackgroundColor(option)}
//                         className={`
//                           size-7
//                           rounded 
//                           cursor-pointer 
//                           flex justify-center items-center
//                           overflow-hidden
//                           ${backgroundColor == option ? 'bg-indigo-300 opacity-60 ' : 'bg-zinc-700 opacity-70'}
//                         `}
//                         >
//                           <div
//                             key={option}
//                             className= {`rounded-sm size-5 `}
//                             style={{backgroundColor: option}}
//                           >
                            
//                           </div>
//                         </div> 
//                       ))}
//                     </div>
//                   </div>
//                   <div className="border-b border-gray-700 pb-2 mb-2">
//                     <label className="text-xs" htmlFor="">
//                       Select Fill
//                     </label>
//                     <div>
//                       <div className="flex space-x-2 mt-1">
//                         {fillOptions.map((option) => (
//                           <div
//                           className={`
//                             size-7
//                             rounded 
//                             cursor-pointer 
//                             flex justify-center items-center
//                             ${fillStyle === option ? 'bg-indigo-300 opacity-60  ' : 'bg-zinc-700 opacity-70 '}
//                           `}
//                           >
//                             <div
//                               key={option}
//                               className='border rounded-sm border-white '
//                               onClick={() => setFillStyle(option)}
//                             >
//                               <img src={`/${option}.png`} className='size-4  rounded-sm' alt="option" />
//                             </div>
//                           </div>
//                         ))}
//                       </div>
//                     </div>
//                   </div> 
//                   <div className="border-b border-gray-700 pb-2 mb-2">
//                     <label className="text-xs" htmlFor="">
//                       Stroke Width 
//                     </label>
//                     <div>
//                       <div className="flex space-x-2 mt-1">
//                         {strokeOptions.map((option,ind) => (
//                           <div
//                           onClick={() => setStrokeWidth((ind*2) + 2)}
//                           className={`
//                             size-7
//                             rounded 
//                             cursor-pointer 
//                             flex justify-center items-center
//                             overflow-hidden
//                             ${strokeWidth === ((ind*2) + 2) ? 'bg-indigo-300 opacity-60 ' : 'bg-zinc-700 opacity-70'}
//                           `}
//                           >
//                             <div 
//                               key={option}
//                               className=' rounded-sm  '  
                            
//                             >
//                               {/* <img src={`/${option}.png`} className='size-4  rounded-sm' alt={option} /> */}
//                               <div className={`bg-white h-[${ind+2}px] text-transparent`}>....</div>
//                             </div>
//                           </div> 
//                         ))}
//                       </div>
//                     </div>
//                   </div>
//                   <div className="border-b border-gray-700 pb-2 mb-2">
//                     <label className="text-xs" htmlFor="">
//                       Stroke Style 
//                     </label>
//                     <div>
//                       <div className="flex space-x-2 mt-1">
//                         {["5,0","5,5"].map((option,ind) => (
//                           <div
//                           onClick={() => setStrokeStyle(option.split(',').map(Number))}
//                           className={`
//                             size-7
//                             rounded 
//                             cursor-pointer 
//                             flex justify-center items-center
//                             overflow-hidden
//                             ${strokeStyle == option ? 'bg-indigo-300 opacity-60 ' : 'bg-zinc-700 opacity-70'}
//                           `}
//                           >
//                             <div
//                               key={option}
//                               className=' rounded-sm '
                              
//                             >
//                               {option=='5,0' && (
//                                 <div className='-mt-3'>___</div>
//                               )}
//                               {option=='5,5' && (
//                                 <div>---</div>
//                               )}
//                             </div>
//                           </div> 
//                         ))}
//                       </div>
//                     </div>
//                   </div>
//                   <div className='flex py-2 border-b border-gray-700 mb-2'>
//                     <label className='text-xs ' htmlFor=""> Fill Gap</label>
//                     <input onChange={(e)=>{
//                       let value = Math.max(0, Math.min(e.target.value,20));
//                       setFillGap(value)
//                       e.target.value = value 
//                     }}   
//                       type="number" 
//                       placeholder='3' 
//                       min={1} 
//                       max={100} 
//                       step={1} 
//                       className="bg-zinc-800 pl-2 ml-2 rounded "
//                     />
//                   </div> 
//                 </div>
//               )}
//               {tool=='text' && ( 
//                 <div>
//                   <div className='flex py-2 border-b border-gray-700 mb-2'>
//                     <label className='text-xs ' htmlFor=""> Font Size</label>
//                     <input onChange={(e)=>{
//                       let value = Math.max(0, Math.min(e.target.value,50));
//                       setFontSize(value)
//                       e.target.value = value 
//                     }}    
//                       type="number" 
//                       placeholder='15' 
//                       min={1} 
//                       max={50} 
//                       step={1} 
//                       className="bg-zinc-800 pl-2 ml-2 rounded  "
//                     />
//                   </div>
//                   <div className="border-b border-gray-700 pb-2 mb-2">
//                     <label className="text-xs" htmlFor="">
//                       Font Family
//                     </label>
//                     <div>
//                       <div className="flex space-x-2 mt-1">
//                         {fonts.map((option,ind) => (
//                           <div
//                           onClick={() => setFontFamily(option)}
//                           className={`
//                             size-7
//                             rounded 
//                             cursor-pointer 
//                             flex justify-center items-center
//                             overflow-hidden
//                             ${fontFamily == option ? 'bg-indigo-300 opacity-60 ' : 'bg-zinc-700 opacity-70'}
//                           `}
//                           >
//                             <div
//                               key={option}
//                               className=' rounded-sm '
//                               style={{fontFamily:option}}
//                             >
//                               A
//                             </div>
//                           </div> 
//                         ))}
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               )}
//             </div>
//           </div>  
//         </motion.div>
//         )}
//         <div
//           className=' h-[82vh] overflow-hidden w-full  '
//           onMouseDown={handleMouseDown}
//           onMouseUp={handleMouseUp}
//           onMouseMove={handleMouseMove}
//           >
//           <canvas ref={canvasRef}/>  
//         </div>
//         {(inputPosition && tool=='text') && (
//           <textarea
//             className='bg-black text-wrap scrollbar-hide border rounded-sm   focus-visible:border-slate-100 '
//             type="text"
//             value={textInput}
//             onChange={(e)=>{
//               textInputHandler(e);  
//               handleResize(e)
//             }}
//             onBlur={handleMouseDown}
//             style={{
//               position: 'absolute',
//               top: inputPosition.offsetY,
//               left: inputPosition.offsetX,
//               fontSize: `${fontSize}px`,
//               fontFamily: fontFamily,
//               color: color,
//               whiteSpace: "pre-wrap", // Ensures text wraps and respects line breaks
//               overflowWrap: "break-word", // Allows words to break if they're too long for the line
//               resize: "none"
//             }}
//             // autoFocus
//           />
//         )} 
//       </div>
//     ) 

//   }
//   return (
//     <>
//     <div
//       className='  h-[84vh] overflow-hidden '
//       >
//       <div style={{width:  window.innerWidth*2}} className=' h-full'>
//         {!imageUrl ? (
//           <div></div>
//         ):
//         (

//         <img
//           src={imageUrl}
//           alt="Real time board image shared by presenter " 
//           style={{
//             height:  window.innerHeight * 2,
//             width:  window.innerWidth*2 ,  
//           }}
//         />
//         )}
//       </div> 
//       <canvas ref={canvasRef}/> 
//     </div> 
//     </>
//   ) 

// }
// export default Board 



// /*
//  line correction
//  add more pages
//  add images
//  if possible then try to remove selected element at random
// */ 
import React, { useEffect, useLayoutEffect, useState, useRef } from 'react'
import rough from 'roughjs';
import { MdOutlineCancel } from "react-icons/md";
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const roughGenerator = rough.generator()

const Board=({
  fileOpen,
  setFileOpen,
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
  const fillOptions = ['hachure', 'solid', 'zigzag', 'cross-hatch']
  const strokeOptions = ['extra-thin', 'thin', 'bold', 'extra-bold']
  const fonts = ["Serif", "Sans-serif", "Monospace", "Cursive", "Fantasy"];
  const strokeColor = ["#FFFFFF", "#1e1e1e", "#e03131", "#2f9e44", "#1971c2", "#f08c00"];
  const bgColor = ["transparent","#FFFFFF",, "#ffc9cf", "#b2f2bb", "#a5d8ff", "#ffec99"];
  const[isDrawing, setIsDrawing] = useState(false);
  const[imageUrl, setImageUrl] = useState(null) 
  const [strokeWidth, setStrokeWidth] = useState('4')
  const [backgroundColor,setBackgroundColor] = useState('transparent')
  const [color, setColor] = useState('#FFFFFF')
  const [fillStyle, setFillStyle] = useState('hachure')
  const [strokeStyle, setStrokeStyle] = useState([5,0])
  const [fillGap, setFillGap] = useState(3)
  const[fontSize, setFontSize] = useState(15)
  const [fontFamily, setFontFamily] = useState("Serif");
  const [selectedElement, setSelectedElement] = useState(null)
  const[textInput, setTextInput] = useState('')
  const[inputPosition, setInputPositioin] = useState(null);
  const [imageSource,setImageSource] = useState('')


  const fileInputRef = useRef(null);

  
  useEffect(() => {
    if (fileOpen && fileInputRef.current) {
      fileInputRef.current.click(); // Open the file dialog
      // setFileOpen(false); // Reset fileOpen to prevent multiple triggers
    }
  }, [fileOpen]);
  // if(fileOpen){
    
  // }

  
  useEffect(()=>{
    socket.on("boardData",(data)=>{
      setImageUrl(data.canvasImage);
    })
  },[socket])  

  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef. current;
      canvas.height = window.innerHeight * 2; 
      canvas.width = window.innerWidth * 2;
      const context = canvas.getContext("2d");
      contextRef.current = context;
    }
  }, []);

  const textClickHandler = (e)=>{
    if(tool=='text'){
      const canvas = e.currentTarget; // Assuming this is the canvas element
      const rect = canvas.getBoundingClientRect(); // Get canvas position
      const offsetX = e.clientX - rect.left; // Adjust X position
      const offsetY = e.clientY - rect.top; 
      setInputPositioin({offsetX, offsetY})
    }
  }

  const textInputHandler = (e)=>{
    setTextInput(e.target.value)
  }

  const handleResize = (event) => {
    // Reset height to 'auto' so it can shrink if needed
    event.target.style.height = "auto";
    // Set height based on scroll height to adjust to content
    event.target.style.height = `${event.target.scrollHeight}px`;
  };

  useLayoutEffect(()=>{
    const roughCanvas = rough.canvas(canvasRef.current);
    // if(elements.length >0){
    //   contextRef.current.clearRect(0,0, canvasRef.current.width, canvasRef.current.height)
    // }
    if(!elements || elements.length > 0){
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
          ) 
        )
      }
      else if(element.type === 'text'){//..............................................................................
        contextRef.current.font = `${element.fontSize}px ${element.fontFamily}`; 
        contextRef.current.fillStyle = element.stroke;
        const lines = element.text.split('\n')
        const lineHeight = element.fontSize * 1.2

        lines.forEach((line,ind)=>{
          contextRef.current.fillText(
            line,
            element.offsetX,
            element.offsetY + ind * lineHeight
          )
        })
      }
      else if(element.type === 'image'){//..............................................................................
        const img = new Image()
        img.src = element.src
        img.onload=()=>{
          contextRef.current.drawImage(
            img,
            element.offsetX,
            element.offsetY,
            element.width,
            element.height,
            // {
            //   roughness:0 
            // }
          )
        }
      }
    }); 
    const canvasImage = canvasRef.current.toDataURL();
    socket.emit("board",canvasImage, groupId, userId)

  },[elements]) 

  const handleMouseDown = (e)=>{
    const{offsetX, offsetY} = e.nativeEvent 

    const clickedElement = elements.findIndex((ele)=>{
      if(ele.type == 'pencil'){ 
        const minX = Math.min(...ele.path.map(point => point[0]));
        const maxX = Math.max(...ele.path.map(point => point[0]));
        const minY = Math.min(...ele.path.map(point => point[1]));
        const maxY = Math.max(...ele.path.map(point => point[1]));

        // Check if click is within the bounding box
        return offsetX >= minX && offsetX <= maxX && offsetY >= minY && offsetY <= maxY;
      }
      else if(ele.type == 'line'){ 
        return(
          offsetX >=ele.offsetX &&
          offsetX <=ele.offsetX + ele.width &&
          offsetY >=ele.offsetY &&
          offsetY <=ele.offsetY + ele.height
        )
      }
      if(ele.type == 'circle' || ele.type === 'ellipse'){
        const dist = Math.sqrt(
          Math.pow(offsetX - ele.offsetX, 2) + Math.pow(offsetY - ele.offsetY, 2)
        );
        return dist <= ele.width / 2; 

      }else if(ele.type == 'rectangle'){ 
        return(
          offsetX >=ele.offsetX &&
          offsetX <=ele.offsetX + ele.width &&
          offsetY >=ele.offsetY &&
          offsetY <=ele.offsetY + ele.height
        )
      }else if(ele.type == 'text'){
        const textWidth = contextRef.current.measureText(ele.text).width;
        const textHeight = ele.fontSize;
        return( 
          offsetX >=ele.offsetX &&
          offsetX <=ele.offsetX + textWidth &&
          offsetY >=ele.offsetY - textHeight &&
          offsetY <=ele.offsetY
        )
      }else if(ele.type == 'image'){ 
        return(
          offsetX >=ele.offsetX &&
          offsetX <=ele.offsetX + ele.width &&
          offsetY >=ele.offsetY &&
          offsetY <=ele.offsetY + ele.height
        )
      }
      return false;
    })
 
    if(clickedElement !== -1){
      setSelectedElement(clickedElement);
      setIsDrawing(true);
    }
    else {
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
            strokeLineDash:strokeStyle,
            seed:20
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
        // const newText = window.prompt('Enter text:', '');
        // if (newText) {
          setElements((prev) => [
            ...prev,
            {
              type: 'text',
              text: textInput,
              offsetX,
              offsetY,
              stroke: color,
              fontSize: fontSize,
              fontFamily:fontFamily,

            }
          ]);
          setInputPositioin(null);
          setTextInput('')
        // }
      }else if(tool == 'image'){
        const img = new Image();
        img.src = imageSource;
        img.onload = ()=>{
          setElements((prevElements)=>[
            ...prevElements,
            {
              type:"image",
              src:imageSource,
              offsetX,
              offsetY,
              width: 100,
              height: 100,
            }
          ])
        }
        img.onerror = () => {
          toast.error('Failed to load image. Please check the URL.')
        };
      }
    }


    setIsDrawing(true);
  } 


  const handleMouseUp = (e)=>{
    setIsDrawing(false);
    setSelectedElement(null);
  }


  const handleMouseMove = (e) => {
    const { offsetX, offsetY } = e.nativeEvent;
  
    if (isDrawing ) {
      // Update position of selected text element
      if(selectedElement !== null){
        setElements((prevElements) =>
          prevElements.map((element, index) => {
            if(index==selectedElement){
              if(element.type === 'pencil'){
                const deltaX = offsetX - element.offsetX;
                const deltaY = offsetY - element.offsetY;

                const newPath = element.path.map(([x, y]) => [x + deltaX, y + deltaY]);
                return {
                  ...element,
                  path: newPath,
                  offsetX,  
                  offsetY,
                  // style:{
                  //   ...element.style,
                  //   cursor:"pointer",
                  //   border: '1px dashed black', 
                  // } 
                }  
              } 
              else if(element.type === 'line'){
                const deltaX = offsetX - element.offsetX; // Change in X
                const deltaY = offsetY - element.offsetY; // Change in Y
 
                return {
                  ...element,
                  offsetX, // Update new starting point X
                  offsetY, // Update new starting point Y
                  width: element.width + deltaX, // Adjust endpoint X
                  height: element.height + deltaY, // Adjust endpoint Y
                };
              }
              else if(element.type === 'circle' || element.type === 'ellipse'){
                return {
                  ...element,
                  offsetX: offsetX, 
                  offsetY: offsetY,
                } 
              } 
              else if (element.type === 'rectangle') {
                return {
                  ...element,
                  offsetX: offsetX, 
                  offsetY: offsetY,
                }; 
              }
              else if (element.type === 'text') {
                return {
                  ...element,
                  offsetX: offsetX, 
                  offsetY: offsetY, 
                };
              }
              else if (element.type === 'image') {
                return {
                  ...element,
                  offsetX: offsetX, 
                  offsetY: offsetY, 
                };
              }
            }
            return element;  
          })
        );
      }else {
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
                  width:offsetX - element.offsetX,
                  height:offsetY - element.offsetY
                }
              }else{
                return element;
              }
            })
          )   
        }else if(tool == 'image'){
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
  };
 
  if(userId == hostId){ 
    return (
      <div className='relative ' onClick={textClickHandler}>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0,x:10 }} // Starts off-screen to the left
            animate={{ opacity: 1, x: 0 }} // Slides to its original position
            transition={{ duration: 0.6 }}
            className='text-white right-3 rounded-lg bg-zinc-900 p-1 mt-10 z-10   absolute  '
          >
          <div> 
            <div className='mx-2'>
              <div className='relative'>
                <MdOutlineCancel onClick={()=>setIsOpen(false)} className='absolute hover:shadow-md hover:shadow-white rounded-full size-5 right-2 top-2 cursor-pointer'/>
              </div>
              <div className='pt-8 border-b border-gray-700 pb-2 mb-2'>
                <label className="text-xs" htmlFor="">
                  Stroke  
                </label>
                <div className="flex space-x-2 mt-1">
                  {strokeColor.map((option,ind) => (
                    <div
                    onClick={() => setColor(option)}
                    className={`
                      size-7
                      rounded 
                      cursor-pointer 
                      flex justify-center items-center
                      overflow-hidden
                      ${color == option ? 'bg-indigo-300 opacity-60 ' : 'bg-zinc-700 opacity-70'}
                    `}
                    >
                      <div
                        key={option}
                        className= {`rounded-sm size-5 `}
                        style={{backgroundColor: option}}
                      >
                        
                      </div>
                    </div> 
                  ))}
                </div>
              </div>

              {tool != 'text' && (
                <div>
                  <div className=' border-b border-gray-700 pb-2 mb-2'>
                    <label className="text-xs" htmlFor="">
                      Background  
                    </label>
                    <div className="flex space-x-2 mt-1">
                      {bgColor.map((option,ind) => (
                        <div
                        onClick={() => setBackgroundColor(option)}
                        className={`
                          size-7
                          rounded 
                          cursor-pointer 
                          flex justify-center items-center
                          overflow-hidden
                          ${backgroundColor == option ? 'bg-indigo-300 opacity-60 ' : 'bg-zinc-700 opacity-70'}
                        `}
                        >
                          <div
                            key={option}
                            className= {`rounded-sm size-5 `}
                            style={{backgroundColor: option}}
                          >
                            
                          </div>
                        </div> 
                      ))}
                    </div>
                  </div>
                  <div className="border-b border-gray-700 pb-2 mb-2">
                    <label className="text-xs" htmlFor="">
                      Select Fill
                    </label>
                    <div>
                      <div className="flex space-x-2 mt-1">
                        {fillOptions.map((option) => (
                          <div
                          className={`
                            size-7
                            rounded 
                            cursor-pointer 
                            flex justify-center items-center
                            ${fillStyle === option ? 'bg-indigo-300 opacity-60  ' : 'bg-zinc-700 opacity-70 '}
                          `}
                          >
                            <div
                              key={option}
                              className='border rounded-sm border-white '
                              onClick={() => setFillStyle(option)}
                            >
                              <img src={`/${option}.png`} className='size-4  rounded-sm' alt="option" />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div> 
                  <div className="border-b border-gray-700 pb-2 mb-2">
                    <label className="text-xs" htmlFor="">
                      Stroke Width 
                    </label>
                    <div>
                      <div className="flex space-x-2 mt-1">
                        {strokeOptions.map((option,ind) => (
                          <div
                          onClick={() => setStrokeWidth((ind*2) + 2)}
                          className={`
                            size-7
                            rounded 
                            cursor-pointer 
                            flex justify-center items-center
                            overflow-hidden
                            ${strokeWidth === ((ind*2) + 2) ? 'bg-indigo-300 opacity-60 ' : 'bg-zinc-700 opacity-70'}
                          `}
                          >
                            <div 
                              key={option}
                              className=' rounded-sm  '  
                            
                            >
                              {/* <img src={`/${option}.png`} className='size-4  rounded-sm' alt={option} /> */}
                              <div className={`bg-white h-[${ind+2}px] text-transparent`}>....</div>
                            </div>
                          </div> 
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="border-b border-gray-700 pb-2 mb-2">
                    <label className="text-xs" htmlFor="">
                      Stroke Style 
                    </label>
                    <div>
                      <div className="flex space-x-2 mt-1">
                        {["5,0","5,5"].map((option,ind) => (
                          <div
                          onClick={() => setStrokeStyle(option.split(',').map(Number))}
                          className={`
                            size-7
                            rounded 
                            cursor-pointer 
                            flex justify-center items-center
                            overflow-hidden
                            ${strokeStyle == option ? 'bg-indigo-300 opacity-60 ' : 'bg-zinc-700 opacity-70'}
                          `}
                          >
                            <div
                              key={option}
                              className=' rounded-sm '
                              
                            >
                              {option=='5,0' && (
                                <div className='-mt-3'>___</div>
                              )}
                              {option=='5,5' && (
                                <div>---</div>
                              )}
                            </div>
                          </div> 
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className='flex py-2 border-b border-gray-700 mb-2'>
                    <label className='text-xs ' htmlFor=""> Fill Gap</label>
                    <input onChange={(e)=>{
                      let value = Math.max(0, Math.min(e.target.value,20));
                      setFillGap(value)
                      e.target.value = value 
                    }}   
                      type="number" 
                      placeholder='3' 
                      min={1} 
                      max={100} 
                      step={1} 
                      className="bg-zinc-800 pl-2 ml-2 rounded "
                    />
                  </div> 
                </div>
              )}
              {tool=='text' && ( 
                <div>
                  <div className='flex py-2 border-b border-gray-700 mb-2'>
                    <label className='text-xs ' htmlFor=""> Font Size</label>
                    <input onChange={(e)=>{
                      let value = Math.max(0, Math.min(e.target.value,50));
                      setFontSize(value)
                      e.target.value = value 
                    }}    
                      type="number" 
                      placeholder='15' 
                      min={1} 
                      max={50} 
                      step={1} 
                      className="bg-zinc-800 pl-2 ml-2 rounded  "
                    />
                  </div>
                  <div className="border-b border-gray-700 pb-2 mb-2">
                    <label className="text-xs" htmlFor="">
                      Font Family
                    </label>
                    <div>
                      <div className="flex space-x-2 mt-1">
                        {fonts.map((option,ind) => (
                          <div
                          onClick={() => setFontFamily(option)}
                          className={`
                            size-7
                            rounded 
                            cursor-pointer 
                            flex justify-center items-center
                            overflow-hidden
                            ${fontFamily == option ? 'bg-indigo-300 opacity-60 ' : 'bg-zinc-700 opacity-70'}
                          `}
                          >
                            <div
                              key={option}
                              className=' rounded-sm '
                              style={{fontFamily:option}}
                            >
                              A
                            </div>
                          </div> 
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
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
        {(inputPosition && tool=='text') && (
          <textarea
            className='bg-black text-wrap scrollbar-hide border rounded-sm   focus-visible:border-slate-100 '
            type="text"
            value={textInput}
            onChange={(e)=>{
              textInputHandler(e);  
              handleResize(e)
            }}
            onBlur={handleMouseDown}
            style={{
              position: 'absolute',
              top: inputPosition.offsetY,
              left: inputPosition.offsetX,
              fontSize: `${fontSize}px`,
              fontFamily: fontFamily,
              color: color,
              whiteSpace: "pre-wrap", // Ensures text wraps and respects line breaks
              overflowWrap: "break-word", // Allows words to break if they're too long for the line
              resize: "none"
            }}
          />
        )}
        <input
          ref={fileInputRef} 
          type="file"
          accept="image/*" 
          className='hidden'   
          onChange={(e) => {
            const file = e.target.files[0];
            if (file) {
              const reader = new FileReader();
              reader.onload = (event) => {
                setImageSource(event.target.result); // Set the base64 image source
              };
              reader.readAsDataURL(file); // Read the file as a data URL
              // setImageSource('')
            }
            setFileOpen(false)
            e.target.files[0] = '';
          }}
        />


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
          alt="Real time board image shared by presenter " 
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



/*
 line correction
 add more pages
 add images
 if possible then try to remove selected element at random
*/ 