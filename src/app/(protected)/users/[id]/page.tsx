import { UserDetail } from "@/features/users/view/user-detail-view";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "User Profile | Dashboard",
  description: "View and manage user profile details.",
};
interface Props{
  params: {
    id: string
  }
}

export default function UserDetailPage({ params }: Props) {
  return <UserDetail id={params.id} />;
}
