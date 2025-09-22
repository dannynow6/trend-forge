import LogoImg from "../../../public/logo.png";
import Image from "next/image";

const Logo = () => {
  return (
    <div className="flex items-center justify-center p-4 rounded-full h-32 w-32 bg-gradient-to-br from-sky-100 to-blue-100 shadow-lg">
      <Image src={LogoImg} alt="Logo" className="w-24 h-24" priority />
    </div>
  );
};

export default Logo;
