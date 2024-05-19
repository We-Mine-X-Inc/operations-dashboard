import FarmMaintenanceJobConfigurationForm from "./components/farmMaintenanceJobConfigurationForm";
import MinerStatusTable from "./components/minerStatusTable";
import { SessionProvider } from "next-auth/react";

export default function Home() {
  return (
    // <SessionProvider session={session}>
    <main className="flex min-h-screen flex-col items-center text-center gap-y-10 p-24">
      <div className="w-full border-white border-solid border-2 p-3">
        <div className="text-center">Maintenance Job Configuration</div>
        <FarmMaintenanceJobConfigurationForm />
      </div>

      <div className="w-full flex flex-col items-center text-center border-white border-solid border-2 p-3">
        <div className="text-center">Hosted Miners Statuses</div>

        <MinerStatusTable />
      </div>
    </main>
    // </SessionProvider>
  );
}
