"use client";
import { SignUp } from "@clerk/nextjs";
import { useState } from "react";
import { User, Gavel } from "lucide-react";

export default function SignupCatchallPage() {
  const [role, setRole] = useState("user");

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#fbfbfb] py-12 px-4">
      <div className="w-full max-w-100 mb-8">
        <label className="block text-center text-[#111111] font-bold mb-4 text-lg">
          Join Nyayak as a:
        </label>
        <div className="flex p-1 bg-nyayak-slate rounded-xl gap-1">
          <button
            type="button"
            onClick={() => setRole("user")}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg font-semibold transition-all ${
              role === "user"
                ? "bg-[#fbfbfb] text-[#111111] shadow-md"
                : "text-[#111111] hover:text-gray-500"
            }`}
          >
            <User size={18} />
            Client
          </button>
          <button
            type="button"
            onClick={() => setRole("lawyer")}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg font-semibold transition-all ${
              role === "lawyer"
                ? "bg-[#fbfbfb] text-[#111111] shadow-md"
                : "text-[#111111] hover:text-gray-500"
            }`}
          >
            <Gavel size={18} />
            Lawyer
          </button>
        </div>
      </div>


      <SignUp
        path="/signup"
        routing="path"
        signInUrl="/signin"
        forceRedirectUrl="/Dashboard"
        unsafeMetadata={{ role }}
        appearance={{
          elements: {
            rootBox: "w-full max-w-100",
            card: "shadow-2xl border border-nyayak-slate rounded-2xl mt-0",
            formButtonPrimary: `bg-[#111111] hover:bg-[#111111] transition-all border-none py-3 shadow-lg`,
            headerTitle: "text-xl font-bold",
            footerActionLink: "text-[#111111] font-semibold"
          }
        }}
      />
    </div>
  );
}
