import { useEffect, useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Bell } from 'lucide-react';
import { toast } from 'react-toastify';
import {
  fetchAdminNotifications,
  markAllRead,
  addRealtimeNotification,
} from '../../features/notifications/notificationSlice';
import {
  listenNotificationNew,
  removeNotificationNewListener,
} from '../../services/socket';

export default function NotificationBell() {
  const dispatch = useDispatch();
  const { list, unreadCount } = useSelector((s) => s.adminNotifications);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchAdminNotifications());
  }, [dispatch]);

  const handleRealtime = useCallback(
    (notification) => {
      dispatch(addRealtimeNotification(notification));
      toast.info(`🔔 ${notification.title}: ${notification.body}`);
    },
    [dispatch]
  );

  useEffect(() => {
    listenNotificationNew(handleRealtime);
    return () => removeNotificationNewListener(handleRealtime);
  }, [handleRealtime]);

  return (
    <div className="relative">
      <button
        onClick={() => {
          setOpen((o) => !o);
          if (unreadCount > 0) dispatch(markAllRead());
        }}
        className="relative h-9 w-9 rounded-lg flex items-center justify-center hover:bg-white/10 text-navy-200"
      >
        <Bell size={18} />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] rounded-full h-4 w-4 flex items-center justify-center font-bold">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 max-h-96 overflow-y-auto bg-white rounded-xl shadow-2xl border border-gray-100 z-50">
          <div className="p-3 border-b font-semibold text-sm text-navy-900">Notifications</div>
          {list.length === 0 ? (
            <p className="p-4 text-sm text-gray-400 text-center">No notifications yet</p>
          ) : (
            list.map((n) => (
              <div key={n._id} className={`p-3 border-b text-sm ${!n.read ? 'bg-brand-50' : ''}`}>
                <p className="font-semibold text-navy-900">{n.title}</p>
                <p className="text-gray-500 text-xs mt-0.5">{n.body}</p>
                <p className="text-gray-400 text-[10px] mt-1">
                  {new Date(n.createdAt).toLocaleString()}
                </p>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}