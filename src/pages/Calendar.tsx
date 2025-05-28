
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { Calendar as CalendarIcon } from "lucide-react";
import { usePaymentReminders, PaymentReminder } from "@/hooks/use-payment-reminders";

const Calendar = () => {
  const [date, setDate] = useState<Date>(new Date());
  const { data: reminders = [], isLoading } = usePaymentReminders();

  // Filter events for the selected date
  const selectedDateEvents = reminders.filter(reminder => {
    const reminderDate = new Date(reminder.due_date);
    return reminderDate.getDate() === date.getDate() && 
           reminderDate.getMonth() === date.getMonth() && 
           reminderDate.getFullYear() === date.getFullYear();
  });
  
  // Find dates with events for highlighting on the calendar
  const eventDates = reminders.map(reminder => new Date(reminder.due_date));
  
  // Upcoming events (from today forward)
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const upcomingEvents = reminders
    .filter(reminder => new Date(reminder.due_date) >= today && !reminder.is_completed)
    .sort((a, b) => new Date(a.due_date).getTime() - new Date(b.due_date).getTime())
    .slice(0, 5);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Calendar</h1>
          <p className="text-muted-foreground">Track upcoming payments and financial deadlines</p>
        </div>
        <div className="flex items-center justify-center py-12">
          <p>Loading calendar data...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Calendar</h1>
        <p className="text-muted-foreground">Track upcoming payments and financial deadlines</p>
      </div>

      <div className="grid gap-4 grid-cols-1 lg:grid-cols-4">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Calendar</CardTitle>
            <CardDescription>Select a date to view events</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <CalendarComponent
              mode="single"
              selected={date}
              onSelect={(newDate) => newDate && setDate(newDate)}
              className="rounded-md w-full"
              modifiers={{
                eventDay: (day) => {
                  return eventDates.some(eventDate => 
                    eventDate.getDate() === day.getDate() &&
                    eventDate.getMonth() === day.getMonth() &&
                    eventDate.getFullYear() === day.getFullYear()
                  );
                }
              }}
              modifiersStyles={{
                eventDay: { 
                  fontWeight: "bold",
                  backgroundColor: "hsl(var(--primary) / 0.1)" 
                }
              }}
            />
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>
              {date.toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </CardTitle>
            <CardDescription>
              {selectedDateEvents.length > 0 
                ? `${selectedDateEvents.length} payment reminder${selectedDateEvents.length > 1 ? 's' : ''}`
                : "No payment reminders for this date"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {selectedDateEvents.length > 0 ? (
              <div className="space-y-4">
                {selectedDateEvents.map(event => (
                  <div key={event.id} className="flex items-start space-x-4 p-3 rounded-lg border">
                    <div className="bg-primary/10 p-2 rounded-full">
                      <CalendarIcon className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <h4 className="font-medium">{event.title}</h4>
                        {event.amount && (
                          <span className="font-medium">${event.amount.toFixed(2)}</span>
                        )}
                      </div>
                      <div className="flex items-center mt-1 text-sm text-muted-foreground">
                        <span className="mr-2">{event.category}</span>
                        <span className="mr-2">•</span>
                        <span className="mr-2">{event.vendor}</span>
                        {event.document_id && (
                          <span className="text-xs bg-secondary px-2 py-0.5 rounded-full">
                            Linked to document
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <CalendarIcon className="h-10 w-10 text-muted-foreground mb-2" />
                <h3 className="text-lg font-medium">No reminders</h3>
                <p className="text-sm text-muted-foreground">
                  There are no payment reminders scheduled for this date
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Upcoming Payments</CardTitle>
          <CardDescription>Next 5 scheduled payments from your documents</CardDescription>
        </CardHeader>
        <CardContent>
          {upcomingEvents.length > 0 ? (
            <div className="space-y-4">
              {upcomingEvents.map(event => (
                <div key={event.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">{event.title}</h4>
                    <p className="text-sm text-muted-foreground">
                      {event.vendor} • {event.category}
                    </p>
                  </div>
                  <div className="text-right">
                    {event.amount && (
                      <p className="font-medium">${event.amount.toFixed(2)}</p>
                    )}
                    <p className="text-sm text-muted-foreground">
                      {new Date(event.due_date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <CalendarIcon className="h-10 w-10 text-muted-foreground mb-2" />
              <h3 className="text-lg font-medium">No upcoming payments</h3>
              <p className="text-sm text-muted-foreground">
                Upload documents to automatically detect payment reminders
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Calendar;
