import React from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const localizer = momentLocalizer(moment);

function CalendarComponent({ events, tasks, onEventAdd, onTaskDrop }) {
  const handleSelectSlot = ({ start, end }) => {
    const title = window.prompt('Enter event title for this time slot:');
    if (title) {
      const newEvent = {
        start,
        end,
        title,
      };
      onEventAdd(newEvent);
    }
  };

  const handleEventDrop = ({ event, start, end }) => {
    const updatedEvent = { ...event, start, end };
    onEventAdd(updatedEvent);
  };

  const handleTaskDrop = (task, start, end) => {
    onTaskDrop(task, start, end);
  };

  const handleDrop = (dropInfo) => {
    const { start, end } = dropInfo;
    try {
      const taskData = JSON.parse(dropInfo.draggedEl.getAttribute('data-task'));
      handleTaskDrop(taskData, start, end);
    } catch (error) {
      console.error('Error parsing dropped task data:', error);
    }
  };

  return (
    <div className="calendar-container">
      <Calendar
        localizer={localizer}
        events={[...events, ...tasks.filter(task => task.scheduledStart && task.scheduledEnd).map(task => ({
          id: task.id,
          title: task.title,
          start: new Date(task.scheduledStart),
          end: new Date(task.scheduledEnd),
          task: task
        }))]}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500 }}
        selectable
        onSelectSlot={handleSelectSlot}
        onEventDrop={handleEventDrop}
        onDropFromOutside={handleDrop}
        droppable={true}
      />
    </div>
  );
}

export default CalendarComponent;
