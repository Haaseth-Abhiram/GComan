/** Admin → Notifications: send messages, scheduled reminders, and what you sent. */
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MessageComposer, SentList } from '@/portal/components/Notifications';
import RemindersTab from '@/components/admin/RemindersTab';

const NotificationsAdmin = () => (
  <div className="space-y-6">
    <div>
      <h1 className="text-2xl font-bold">Notifications</h1>
      <p className="text-sm text-muted-foreground">Send a message to employees, set the automatic reminders, and see how many have read your messages.</p>
    </div>
    <Tabs defaultValue="send" className="space-y-4">
      <TabsList>
        <TabsTrigger value="send">Send message</TabsTrigger>
        <TabsTrigger value="reminders">Reminders</TabsTrigger>
        <TabsTrigger value="sent">Sent</TabsTrigger>
      </TabsList>
      <TabsContent value="send"><MessageComposer /></TabsContent>
      <TabsContent value="reminders"><RemindersTab /></TabsContent>
      <TabsContent value="sent"><SentList /></TabsContent>
    </Tabs>
  </div>
);

export default NotificationsAdmin;
