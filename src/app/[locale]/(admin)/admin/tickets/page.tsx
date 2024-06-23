import TicketAction from "@/components/Admin/Tickets/TicketAction";
import { sql } from "@vercel/postgres";

async function getTickets() {
  try {
    const res = await sql`SELECT * FROM support_tickets`;

    return res.rows;
  } catch (error) {
    console.error(error);
    return [];
  }
}

export default async function page() {
  const tickets = (await getTickets()) as Ticket[];
  const openTickets = tickets?.filter((ticket) => ticket.stage === "open");
  const inProgressTickets = tickets?.filter((ticket) => ticket.stage === "in progress");
  const closedTickets = tickets?.filter((ticket) => ticket.stage === "closed");

  return (
    <div className="flex w-full flex-col gap-[5rem] pl-[6.5rem] lg:items-center">
      <div className="mt-[3rem] flex w-full flex-col gap-[2rem]">
        <div className="flex w-full px-[1rem] lg:justify-center">
          <h2 className="text-[2rem] font-bold">Open Tickets</h2>
        </div>
        <div className="flex max-h-[60rem] min-h-[4rem] w-full flex-col overflow-x-auto overflow-y-auto lg:items-center ">
          <div className="grid w-[100rem] grid-cols-4 rounded-t-xl bg-green-600 px-[1rem] py-[1.5rem] text-white">
            <div className="col-span-1 m-auto text-[1.5rem]">ID</div>
            <div className="col-span-1 m-auto text-[1.5rem]">Issuer</div>
            <div className="col-span-1 m-auto text-[1.5rem]">Topic</div>
            <div className="col-span-1 m-auto text-[1.5rem]">Actions</div>
          </div>
          {openTickets.map((ticket) => (
            <div key={ticket.id} className="grid w-[100rem] grid-cols-4 bg-white px-[1rem] py-[1.5rem] text-black">
              <div className="col-span-1 m-auto text-[1.5rem]">{ticket.id}</div>
              <div className="col-span-1 m-auto w-[15rem] truncate text-[1.5rem]">{ticket.issuer_name}</div>
              <div className="col-span-1 m-auto text-[1.5rem]">{ticket.topic}</div>
              <div className="col-span-1 m-auto flex items-center justify-center gap-[2rem] text-[1.5rem]">
                <TicketAction ticket={ticket} />
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-[3rem] flex w-full flex-col gap-[2rem]">
        <div className="flex w-full px-[1rem] lg:justify-center">
          <h2 className="text-[2rem] font-bold">In Progress</h2>
        </div>
        <div className="flex max-h-[60rem] min-h-[4rem] w-full flex-col overflow-x-auto overflow-y-auto lg:items-center">
          <div className="grid w-[100rem] grid-cols-4 rounded-t-xl bg-green-600 px-[1rem] py-[1.5rem] text-white">
            <div className="col-span-1 m-auto text-[1.5rem]">ID</div>
            <div className="col-span-1 m-auto text-[1.5rem]">Issuer</div>
            <div className="col-span-1 m-auto text-[1.5rem]">Topic</div>
            <div className="col-span-1 m-auto text-[1.5rem]">Actions</div>
          </div>
          {inProgressTickets.map((ticket) => (
            <div key={ticket.id} className="grid w-[100rem] grid-cols-4 bg-white px-[1rem] py-[1.5rem] text-black">
              <div className="col-span-1 m-auto text-[1.5rem]">{ticket.id}</div>
              <div className="col-span-1 m-auto w-[15rem] truncate text-[1.5rem]">{ticket.issuer_name}</div>
              <div className="col-span-1 m-auto text-[1.5rem]">{ticket.topic}</div>
              <div className="col-span-1 m-auto flex items-center justify-center gap-[2rem] text-[1.5rem]">
                <TicketAction ticket={ticket} />
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-[3rem] flex w-full flex-col gap-[2rem]">
        <div className="flex w-full px-[1rem] lg:justify-center">
          <h2 className="text-[2rem] font-bold">Closed Tickets</h2>
        </div>
        <div className="flex max-h-[60rem] min-h-[4rem] w-full flex-col overflow-x-auto overflow-y-auto lg:items-center">
          <div className="grid w-[100rem] grid-cols-4 rounded-t-xl bg-green-600 px-[1rem] py-[1.5rem] text-white">
            <div className="col-span-1 m-auto text-[1.5rem]">ID</div>
            <div className="col-span-1 m-auto text-[1.5rem]">Issuer</div>
            <div className="col-span-1 m-auto text-[1.5rem]">Topic</div>
            <div className="col-span-1 m-auto text-[1.5rem]">Actions</div>
          </div>
          {closedTickets.map((ticket) => (
            <div key={ticket.id} className="grid w-[100rem] grid-cols-4 bg-white px-[1rem] py-[1.5rem] text-black">
              <div className="col-span-1 m-auto text-[1.5rem]">{ticket.id}</div>
              <div className="col-span-1 m-auto w-[15rem] truncate text-[1.5rem]">{ticket.issuer_name}</div>
              <div className="col-span-1 m-auto text-[1.5rem]">{ticket.topic}</div>
              <div className="col-span-1 m-auto flex items-center justify-center gap-[2rem] text-[1.5rem]">
                <TicketAction ticket={ticket} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
