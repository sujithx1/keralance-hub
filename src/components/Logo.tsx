
interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  hideSub?: boolean;
}

export default function Logo({ className = "", size = "md", hideSub = false }: LogoProps) {
  // Size mapping
  const sizeClasses = {
    sm: {
      text: "text-lg",
      palm: "h-5 w-5",
      dots: "h-1.5 w-1.5",
      bannerText: "text-[7px]",
      bannerPadding: "px-1.5 py-0.5",
      hubText: "text-xs",
      waves: "w-5 h-3",
    },
    md: {
      text: "text-2xl",
      palm: "h-7 w-7",
      dots: "h-2 w-2",
      bannerText: "text-[8px] tracking-widest",
      bannerPadding: "px-2 py-0.5 -mt-0.5",
      hubText: "text-sm tracking-wider",
      waves: "w-6 h-4",
    },
    lg: {
      text: "text-4xl",
      palm: "h-11 w-11",
      dots: "h-3 w-3",
      bannerText: "text-[11px] tracking-widest",
      bannerPadding: "px-3.5 py-1 -mt-1",
      hubText: "text-xl tracking-widest",
      waves: "w-9 h-5",
    },
  };

  const scale = sizeClasses[size];

  return (
    <div className={`flex flex-col items-start ${className} select-none`}>
      {/* Upper Logo Line: keralance + HUB */}
      <div className="flex items-center space-x-2">
        
        {/* keralance word */}
        <div className="flex items-center relative font-heading font-extrabold text-primary leading-none">
          <span>kera</span>
          
          {/* Palm Tree SVG replacing "l" */}
          <span className="inline-block -mx-0.5 transform -translate-y-[10%] shrink-0">
            <svg
              className={`${scale.palm} fill-current text-primary`}
              viewBox="0 0 100 100"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Palm Trunk */}
              <path d="M48 95 C 49 70, 52 45, 50 20 L 53 20 C 55 45, 52 70, 51 95 Z" />
              {/* Palm Leaves */}
              <path d="M51 25 Q 20 20, 10 42 Q 22 28, 51 25" />
              <path d="M51 25 Q 15 -10, 32 -15 Q 38 10, 51 25" />
              <path d="M51 25 Q 50 -25, 62 -20 Q 58 10, 51 25" />
              <path d="M51 25 Q 85 -5, 78 20 Q 68 12, 51 25" />
              <path d="M51 25 Q 88 32, 70 52 Q 62 38, 51 25" />
            </svg>
          </span>
          
          {/* "an" */}
          <span>an</span>
          
          {/* "ce" with 2 yellow dots over */}
          <span className="relative">
            <span>ce</span>
            
            {/* Gold dots representing the 2 community dots */}
            <span className="absolute -top-1.5 left-0.5 right-0.5 flex justify-between px-0.5">
              <span className={`${scale.dots} rounded-full bg-accent`} />
              <span className={`${scale.dots} rounded-full bg-accent`} />
            </span>
          </span>
        </div>

        {/* HUB text + Waves */}
        <div className="flex items-center space-x-1.5">
          <span className={`font-heading font-extrabold text-secondary uppercase ${scale.hubText}`}>
            HUB
          </span>
          
          {/* Three Backwater Waves */}
          <span className="shrink-0 flex flex-col justify-center">
            <svg
              className={`${scale.waves} text-primary stroke-current`}
              viewBox="0 0 30 15"
              fill="none"
              strokeWidth="2"
              strokeLinecap="round"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M2 3 C6 1, 9 5, 13 3 C17 1, 20 5, 24 3 C27 2, 28 3, 28 3" />
              <path d="M2 7 C6 5, 9 9, 13 7 C17 5, 20 9, 24 7 C27 6, 28 7, 28 7" />
              <path d="M2 11 C6 9, 9 13, 13 11 C17 9, 20 13, 24 11 C27 10, 28 11, 28 11" />
            </svg>
          </span>
        </div>

      </div>

      {/* Underline Sub-Banner: FREELANCERS COMMUNITY */}
      {!hideSub && (
        <div className={`bg-accent text-white ${scale.bannerPadding} rounded-xs font-heading font-bold uppercase ${scale.bannerText} mt-0.5 shadow-sm transform -rotate-1 origin-left`}>
          Freelancers Community
        </div>
      )}
    </div>
  );
}
