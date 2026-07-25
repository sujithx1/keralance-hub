interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  hideSub?: boolean;
}

export default function Logo({ className = "", size = "md" }: LogoProps) {
  // Height mapping based on size
  const heightClasses = {
    sm: "h-7",
    md: "h-9",
    lg: "h-14",
  };

  const height = heightClasses[size];

  return (
    <div className={`flex items-center ${className} select-none`}>
      <img
        src="https://res.cloudinary.com/ded1lrbaz/image/upload/v1784979761/c07ddb3d-e3a2-4489-ab36-050af2430aa4_ajm5ay.jpg"
        alt="keralance HUB Logo"
        className={`${height} object-contain rounded-md`}
      />
    </div>
  );
}
