import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";


export default function NotFound() {
    const navigate = useNavigate()
  return (
    <div className="h-screen w-screen flex justify-center bg-[#f0f0f0]">
        <div className="flex items-center flex-col">
            <img src="https://i.pinimg.com/originals/7d/a6/0b/7da60b8c60a367108e55e942ced5daae.gif" alt="404" />
            <Button onClick={() => navigate(-1)}>Return</Button>
        </div>
    </div>
  )
}
