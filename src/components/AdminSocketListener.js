import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { socket } from "../socket";
import { updateTicketRealtimeAdmin } from "../features/tickets/ticketsAdminSlice";

export default function AdminSocketListener() {
  const dispatch = useDispatch();
  const user = useSelector((s) => s.auth.user);

  useEffect(() => {
    if (!user?._id) return;

    const onTicketNew = (data) => {
      console.log("🎫 New ticket received:", data);
      dispatch(updateTicketRealtimeAdmin(data));
    };
    const onTicketUpdated = (data) => {
      dispatch(updateTicketRealtimeAdmin(data));
    };

    socket.on("ticket:new", onTicketNew);
    socket.on("ticket:updated", onTicketUpdated);

    return () => {
      socket.off("ticket:new", onTicketNew);
      socket.off("ticket:updated", onTicketUpdated);
    };
  }, [user, dispatch]);

  return null;
}