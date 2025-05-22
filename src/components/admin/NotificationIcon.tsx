import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Bell,
  X,
  Package,
  Clock,
  CheckCircle,
  AlertCircle,
  Truck
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

// Mock notifications data
const mockNotifications = [
  {
    id: "notif-001",
    type: "new_order",
    title: "New Order Received",
    message: "Order #ORD-001 has been placed by John Doe",
    time: "10 minutes ago",
    read: false,
    orderId: "ORD-001",
    status: "pending"
  },
  {
    id: "notif-002",
    type: "payment_received",
    title: "Payment Received",
    message: "Payment for Order #ORD-002 has been received",
    time: "1 hour ago",
    read: false,
    orderId: "ORD-002",
    status: "processing"
  },
  {
    id: "notif-003",
    type: "order_shipped",
    title: "Order Shipped",
    message: "Order #ORD-003 has been shipped to Robert Johnson",
    time: "3 hours ago",
    read: true,
    orderId: "ORD-003",
    status: "shipped"
  },
  {
    id: "notif-004",
    type: "order_delivered",
    title: "Order Delivered",
    message: "Order #ORD-004 has been delivered to Emily Davis",
    time: "1 day ago",
    read: true,
    orderId: "ORD-004",
    status: "delivered"
  },
  {
    id: "notif-005",
    type: "order_cancelled",
    title: "Order Cancelled",
    message: "Order #ORD-005 has been cancelled by Michael Wilson",
    time: "2 days ago",
    read: true,
    orderId: "ORD-005",
    status: "cancelled"
  }
];

const NotificationIcon = () => {
  const [notifications, setNotifications] = useState(mockNotifications);
  const [isOpen, setIsOpen] = useState(false);

  const unreadCount = notifications.filter(notif => !notif.read).length;

  const markAllAsRead = () => {
    setNotifications(notifications.map(notif => ({ ...notif, read: true })));
  };

  const markAsRead = (notificationId: string) => {
    setNotifications(notifications.map(notif => 
      notif.id === notificationId ? { ...notif, read: true } : notif
    ));
  };

  const removeNotification = (notificationId: string) => {
    setNotifications(notifications.filter(notif => notif.id !== notificationId));
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "new_order":
        return <Package className="h-5 w-5 text-primary" />;
      case "payment_received":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "order_shipped":
        return <Truck className="h-5 w-5 text-blue-500" />;
      case "order_delivered":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "order_cancelled":
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
              {unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="flex items-center justify-between border-b p-3">
          <h3 className="font-medium">Notifications</h3>
          {unreadCount > 0 && (
            <Button variant="ghost" size="sm" onClick={markAllAsRead}>
              Mark all as read
            </Button>
          )}
        </div>
        <ScrollArea className="h-[400px]">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-6 text-center">
              <Bell className="h-10 w-10 text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">No notifications</p>
            </div>
          ) : (
            <div className="divide-y">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={cn(
                    "flex items-start gap-3 p-3 hover:bg-muted/50 transition-colors",
                    !notification.read && "bg-muted/30"
                  )}
                >
                  <div className="mt-1">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium">{notification.title}</p>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => removeNotification(notification.id)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {notification.message}
                    </p>
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-muted-foreground">
                        {notification.time}
                      </p>
                      <div className="flex items-center gap-2">
                        {!notification.read && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 px-2 text-xs"
                            onClick={() => markAsRead(notification.id)}
                          >
                            Mark as read
                          </Button>
                        )}
                        <Link to={`/admin/orders`}>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-6 px-2 text-xs"
                            onClick={() => {
                              markAsRead(notification.id);
                              setIsOpen(false);
                            }}
                          >
                            View
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
        <div className="border-t p-2">
          <Link to="/admin/notifications">
            <Button variant="ghost" size="sm" className="w-full justify-center" onClick={() => setIsOpen(false)}>
              View all notifications
            </Button>
          </Link>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default NotificationIcon;
