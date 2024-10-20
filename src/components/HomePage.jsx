import Navbar from "./Navbar"
import { TbDeviceImacCode } from "react-icons/tb";
import { PiChalkboardSimpleBold } from "react-icons/pi";
import { PiChatsCircleBold } from "react-icons/pi";
import { useNavigate } from "react-router-dom";
import {LISTS} from '../constants'


const HomePage = ()=>{
    const navigate = useNavigate()
    // const lists = ["Code-Editor","White-Board","Chat"]
    const listsImage=[TbDeviceImacCode,PiChalkboardSimpleBold,PiChatsCircleBold]
    const colors = ["text-red-500", "text-purple-500", "text-green-500"]
    // const paragraphs = [
    //     "A powerful, real-time collaborative code editor that supports multiple languages. Write, edit, and debug code seamlessly with others in a shared environment.",
    //     "An interactive whiteboard for brainstorming, drawing diagrams, and collaborating visually in real-time. Perfect for team discussions and planning sessions.",
    //     "Instant messaging feature that enables live communication and sharing of ideas with your team. Stay connected and collaborate efficiently."
    // ]
    const paragraphs = [
        "Collaborate on code in real-time with support for multiple languages.",
        "Visualize ideas and diagrams together on a shared digital canvas.",
        "Instant messaging for seamless team communication and collaboration."
    ]
    return(
        <div className="bg-black h-screen  ">
            <div>
                <Navbar/>
            </div>
            <div className="text-white xl:px-[10%]">
                <div className="text-center items-center">
                    <h2 className=" text-transparent font-extrabold bg-clip-text bg-gradient-to-l from-blue-600 to-green-600 text-clip bg-transparent  text-4xl mt-20  ">
                        WELCOME TO ALL-IN-ONE
                    </h2>
                    <p>
                        Unite Ideas, Build the Future Together
                    </p>
                </div>
                <div className="flex flex-col mx-auto gap-4  w-3/5 xl:w-3/5 mt-10 ">
                    {LISTS.map((list,ind)=>{
                        const IconComponent = listsImage[ind]
                        const colorComponent = colors[ind]
                        const para = paragraphs[ind]
                        return(
                            <div className="flex gap-2 border h-20 items-center w-full rounded-xl">
                                <div>
                                    < IconComponent 
                                        onClick={()=>{
                                            navigate(`/${list.toLowerCase()}?choice=${list.toLowerCase()}`)
                                        }}
                                        className={`cursor-pointer ml-2 mt-2 size-8 ${colorComponent}`}  
                                    />
                                </div>
                                <div>
                                    <div className={`${colorComponent}`}>
                                        {list}
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">
                                          {para}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}

export default HomePage