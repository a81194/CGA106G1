package webapp.event.service;

import webapp.event.dto.EventDTO;
import webapp.event.pojo.Event;
import webapp.others.pojo.EventNews;

import java.util.List;

public interface EventService {
    Boolean insert(EventDTO eventDTO);

    List<EventDTO> getAllEvent();

    Boolean updateWinner(EventDTO eventDTO);

    Boolean updateSignupNum(EventDTO eventDTO);

    Boolean cancelSignupNum(EventDTO eventDTO);

    Integer selectEventLimit(EventDTO eventDTO);

    Boolean updateEventStatus(EventDTO eventDTO);

    EventNews randomSelectOneEvent();
     EventDTO selectOneEvent(Integer eventNo);

}
