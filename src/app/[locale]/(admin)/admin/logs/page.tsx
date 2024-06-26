import { unstable_noStore as noStore } from "next/cache";
import LogActions from "@/components/Admin/Logs/LogActions";
import { sql } from "@vercel/postgres";
import { getScopedI18n } from "@/locales/server";

async function getLogs() {
  noStore();
  try {
    const res = await sql`SELECT * FROM action_logs`;
    return res.rows;
  } catch (error) {
    console.error(error);
    return [];
  }
}

export default async function page() {
  const logs = (await getLogs()) as Logs[];
  const word = await getScopedI18n("admin.logs");

  return (
    <div className="flex h-screen w-full flex-col gap-[2rem] py-[4rem] pl-[7rem] pr-[2rem] lg:items-center">
      <h4 className="text-[2.5rem] font-bold ">{word("action_logs")}</h4>
      <div className="flex w-full flex-col overflow-x-auto py-[1rem] lg:items-center">
        <div className="grid min-w-[105rem] max-w-[120rem] grid-cols-7 rounded-t-lg bg-green-700 py-[2rem] text-[1.5rem] text-white shadow-md">
          <div className="col-span-1 m-auto">{word("id")}</div>
          <div className="col-span-1 m-auto">{word("performer_name")}</div>
          <div className="col-span-1 m-auto">{word("performer_id")}</div>
          <div className="col-span-1 m-auto">{word("type")}</div>
          <div className="col-span-1 m-auto">{word("description")}</div>
          <div className="col-span-1 m-auto">{word("timestamp")}</div>
          <div className="col-span-1 m-auto">{word("action")}</div>
        </div>
        {logs.length > 0 &&
          logs.map((log) => (
            <div
              key={log.id}
              className="grid min-w-[105rem] max-w-[120rem] grid-cols-7 bg-white py-[2rem] text-[1.5rem] text-black shadow-md"
            >
              <div className="col-span-1 m-auto flex justify-center">
                <p className="truncate">{log.id}</p>
              </div>
              <div className="col-span-1 m-auto flex justify-center">
                <p className="w-[10rem] truncate">{log.performer_name}</p>
              </div>
              <div className="col-span-1 m-auto flex justify-center">
                <p className="w-[10rem] truncate">{log.performer_id}</p>
              </div>
              <div className="col-span-1 m-auto flex justify-center">
                <p className="truncate">{log.type}</p>
              </div>
              <div className="col-span-1 m-auto flex justify-center">
                <p className="w-[10rem] truncate">{log.description}</p>
              </div>
              <div className="col-span-1 m-auto flex justify-center">
                <p className="w-[15rem] truncate">
                  {log.performed_at.toLocaleDateString()} {log.performed_at.toLocaleTimeString()}
                </p>
              </div>
              <div className="col-span-1 m-auto flex justify-center">
                <LogActions {...log} />
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
