import SignUpForm from "@/components/local/Login/SignUpForm";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";


export default function SignUp() {
    const navigate = useNavigate()
  return (
    <div className="bg-teriary relative w-screen h-screen flex justify-center items-center py-20 px-32">
        <div className="flex-1 w-full h-full border-t border-l border-b border-primary rounded-tl-lg rounded-bl-lg">
            <SignUpForm />
        </div>
        <div className="flex-1 w-full h-full rounded-tr-lg rounded-br-lg">
            <img className="w-full h-full object-cover rounded-tr-lg rounded-br-lg" src="https://i.pinimg.com/736x/45/20/84/4520843969ecefe5d2ecad32ee257074.jpg" alt="" />
        </div>
        <Button onClick={() => navigate('/')} variant='ghost' className="absolute top-6 left-6 text-primary"><ArrowLeft className="w-3 h-3"/> Trở về trang chủ</Button>
    </div>
  )
}