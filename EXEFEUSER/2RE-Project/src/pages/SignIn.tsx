import LoginForm from "@/components/local/Login/LoginForm";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";


export default function SignIn() {
    const navigate = useNavigate()
  return (
    <div className="relative w-screen h-screen flex flex-col lg:flex-row justify-center items-center py-10 lg:py-20 px-6 lg:px-32 bg-teriary">
        <div className="hidden lg:flex flex-1 w-full h-full rounded-tl-lg rounded-bl-lg">
            <img className="w-full h-full object-cover rounded-tl-lg rounded-bl-lg" src="https://i.pinimg.com/736x/45/20/84/4520843969ecefe5d2ecad32ee257074.jpg" alt="" />
        </div>
        <div className="flex-1 w-full h-full border-t border-r border-l border-b border-primary lg:rounded-tr-lg lg:rounded-br-lg lg:p-10 lg:border-l-0">
            <LoginForm />
        </div>
        <Button onClick={() => navigate('/')} variant='ghost' className="absolute top-4 left-4 lg:top-6 lg:left-6 text-primary"><ArrowLeft className="w-4 h-4 lg:w-3 lg:h-3"/>Trở về trang chủ</Button>
    </div>
  )
}
