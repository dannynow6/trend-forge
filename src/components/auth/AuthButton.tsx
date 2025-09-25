// Copyright (c) 2025 Daniel Garro | TrendForge
// SPDX-License-Identifier: MIT

const AuthButton = ({
  ariaLabel,
  bgColor = "bg-sky-100",
  onClick,
  children,
}: {
  ariaLabel: string;
  bgColor?: string;
  onClick: () => void;
  children: React.ReactNode;
}) => {
  return (
    <button
      aria-label={ariaLabel}
      onClick={onClick}
      className={`flex cursor-pointer ${bgColor} items-center justify-center rounded gap-2 shadow-md tracking-wide w-40 h-10 text-slate-700 font-semibold hover:scale-[1.02] hover:text-slate-800 transition-all duration-200 ease-in-out`}
    >
      {children}
    </button>
  );
};

export default AuthButton;
