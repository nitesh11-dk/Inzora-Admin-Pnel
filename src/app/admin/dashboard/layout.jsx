// app/dashboard/layout.js
import Navbar from "@/components/Navbar";
import { cookies } from "next/headers";
import { getUserFromToken } from "@/lib/auth";
import { getBalanceFromApi } from "./actions"; 
import { WalletProvider } from "@/app/context/walletContext"; // client-side

export default async function DashboardLayout({ children }) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  const user = token ? await getUserFromToken(token) : null;

  let wallet = null;
  if (user) {
    try { 
      wallet = await getBalanceFromApi(); 
    } catch (error) {
      console.log("Error fetching wallet:", error);
    }
  }

  return (
    <WalletProvider initialWallet={wallet}> {/*  pass initial server wallet */}
        <Navbar isLoggedIn={!!user} wallet={wallet} >
          <main className="w-full">{children}</main>
        </Navbar>
      
    </WalletProvider>
  );
}
