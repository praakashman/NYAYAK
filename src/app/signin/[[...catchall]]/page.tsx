import { SignIn } from "@clerk/nextjs";

export default function LoginCatchallPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-[#fbfbfb] px-4">
      <SignIn
        path="/signin"
        signUpUrl="/signup"
        routing="path"
        forceRedirectUrl="/Dashboard"
        appearance={{
          elements: {
            formButtonPrimary: 'bg-[#111111] hover:bg-[#111111] transition-all border-none py-3 shadow-lg',
            card: 'shadow-2xl border border-nyayak-slate rounded-2xl',
          }
        }}
      />
    </div>
  );
}
