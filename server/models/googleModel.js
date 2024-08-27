const connection = require('../config/connection')
const {promisify} = require('util')
const moment = require('moment-timezone')
const { google } = require('googleapis')

const promise_connection = promisify(connection.query).bind(connection)

exports.createEvent = async (token, id, room, from, to)=>{

    const parsedDateFromDateTime = moment.tz(from, 'DD-MM-YYYY h:mm A', 'Etc/UTC');
    const isoFormatFromDateTime = parsedDateFromDateTime.format('YYYY-MM-DDTHH:mm:ssZ');

    const parsedDateToDateTime = moment.tz(to, 'DD-MM-YYYY h:mm A', 'Etc/UTC');
    const isoFormatToDateTime = parsedDateToDateTime.format('YYYY-MM-DDTHH:mm:ssZ');
  
    console.log("dates", isoFormatFromDateTime, '  ', isoFormatToDateTime)
    if (!token) {
      return {message: 'No token provided'};
    }
  
    try {
      const oauth2Client = new google.auth.OAuth2();
      oauth2Client.setCredentials({ access_token: token });
  
      const calendar = google.calendar({ version: 'v3', auth: oauth2Client });
  
      const event = {
        summary: room,
        description: 'room has been registered',
        start: {
          dateTime: isoFormatFromDateTime,
          timeZone: 'Asia/Kolkata',
        },
        end: {
          dateTime: isoFormatToDateTime,
          timeZone: 'Asia/Kolkata',
        },
      };
  
      const response = await calendar.events.insert({
        calendarId: 'primary',
        resource: event,
      });
  
      const updateQuery = "UPDATE bookings SET event_id = ? WHERE id = ?";
      await promise_connection(updateQuery, [response.data.id, id]);
  
      return response.data;
    } catch (error) {
      console.error('Error creating event:', error);
      return {message: 'Error creating event'};
    }
}

exports.deleteEvent = async (token, eventId, id) => {


  if (!token || !eventId) {
    return {message: 'Token and eventId are required'};
  }

  try {
    const oauth2Client = new google.auth.OAuth2();
    oauth2Client.setCredentials({ access_token: token });

    const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

    await calendar.events.delete({
      calendarId: 'primary',
      eventId: eventId,
    });

    const updateQuery = "UPDATE bookings SET event_id = NULL WHERE id = ?";
    await promise_connection(updateQuery, [id]);

    return {message: 'Event deleted successfully'};
  } catch (error) {
    console.error('Error deleting event:', error);
    return {message: 'Error deleting event'};
  }
}