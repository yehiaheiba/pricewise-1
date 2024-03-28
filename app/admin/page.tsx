import getCurrentUser from "@/lib/actions/getCurrentUser";

const AdminPage = async () => {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return <p>"Unathorized"</p>;
  }
  if (currentUser?.role == "admin") {
    return <p>"athorized"</p>;
  }

  return <p>Admin Dashboard</p>;
};

export default AdminPage;
