"use client";
import type { Session } from "@supabase/auth-helpers-nextjs";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import ModalCore from "./modalCore";
import { ModalType } from "./modal/modalType";
const Navigation = ({ session }: { session: Session | null }) => {
  const pathname = usePathname();
  const router = useRouter();
  if (session === null && pathname?.includes("/profile")) {
    router.push("/");
  }
  return (
    <header>
      <div className="flex items-center justify-between px-4 py-2 bg-white shadow-md">
        <nav className="hidden md:flex space-x-4">
          <div>
            <Link className="text-gray-600 hover:text-blue-600" href="/">
              Home
            </Link>
          </div>
          {session ? (
            <>
              <div>
                <Link
                  className="text-gray-600 hover:text-blue-600"
                  href="/profile"
                >
                  Profile
                </Link>
              </div>
              <div>
                <Link
                  className="text-gray-600 hover:text-blue-600"
                  href="/sharedStorage"
                >
                  공유스토리지
                </Link>
              </div>
              <div>
                <Link
                  className="text-gray-600 hover:text-blue-600"
                  href="/privateStorage"
                >
                  개인용스토리지
                </Link>
              </div>
            </>
          ) : (
            <>
              <div>
                <ModalCore modalType={ModalType.SignIn}></ModalCore>
              </div>
              <div>
                <ModalCore modalType={ModalType.SignUp}></ModalCore>
              </div>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Navigation;
