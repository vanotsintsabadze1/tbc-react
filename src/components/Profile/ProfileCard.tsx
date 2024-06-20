import ProfileUserID from "./ProfileUserID";
import ProfileUserInformation from "./ProfileUserInformation";
import ProfileUserAddress from "./ProfileUserAddress";
import ProfileUserImage from "./ProfileUserImage";
import ProfileMetrics from "./ProfileMetrics";
import { getSession } from "@auth0/nextjs-auth0";
import { getAllPayments } from "@/scripts/helpers/getAllPayments";

interface Props {
  user: UserDB;
}
export default async function ProfileCard({ user }: Props) {
  const orders = await getAllPayments();
  const session = await getSession();
  if (!session) {
    return null;
  }
  const filteredOrders = orders?.filter((order: Payment) => order.metadata.id === user.user_id) ?? [];
  const orderAmount = filteredOrders.length;

  return (
    <div className="flex w-[40rem] flex-col items-center rounded-[2rem] pb-[1rem] pt-[2rem] md:w-[50rem] xs:w-full dark:bg-white dark:shadow-md">
      <ProfileUserImage user={user} />
      <ProfileUserInformation username={user.name} userId={user.user_id} email={user.email} />
      <div className="flex w-full items-center justify-center">
        <p className="text-[1.2rem] font-light">{user.role} </p>
      </div>
      <ProfileUserID userId={user.user_id} />
      <ProfileMetrics orderAmount={orderAmount} />
      {user.extra_details && <ProfileUserAddress extra_details={user.extra_details} userId={user.user_id} />}
    </div>
  );
}
